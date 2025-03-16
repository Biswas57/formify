from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserRegistrationSerializer, FormSerializer, FormDetailSerializer
from django.contrib.auth.hashers import check_password
from .models import Form, Block, Field
from rest_framework.generics import RetrieveAPIView, ListAPIView
import os
import json
import whisper
import ffmpeg
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import openai
from asgiref.sync import sync_to_async

import tempfile, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .groq_parse import parseTranscribedText
import requests

MIN_CHUNK_NUM = 10
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions"

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model = whisper.load_model("base")

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        formid = self.scope['url_route']['kwargs']['formid']
        print(formid)
        await self.accept()
        self.nchunks = 0
        self.audio_buffer = b""
        self.full_transcript = ""   # Cumulative transcription
        self.latest_transcript = ""  # Most recent transcription
        self.all_attributes = []     # Cumulative list of all attribute dictionaries
        self.current_attributes = {} # Cumulative current attribute dictionary
        self.final_sweep_completed = False
        form = await sync_to_async(Form.objects.get)(id=formid)

        # Build the prompt to send to OpenAI
        self.template = []
        for block in await sync_to_async(list)(form.blocks.all()):  # Convert queryset to list asynchronously
            for field in await sync_to_async(list)(block.fields.all()):
                self.template.append({
                    "block_name": block.block_name,
                    "field_name": field.field_name,
                    "field_type": field.field_type
                })

        print(self.template)
        self.webm_header = None  # store the first valid chunk as header

    async def disconnect(self, close_code):
        # On disconnect, if no final sweep was performed, send the current data
        if not self.final_sweep_completed:
            await self.send(text_data=json.dumps({
                "corrected_audio": self.full_transcript,
                "attributes": self.current_attributes
            }))

    async def receive(self, bytes_data=None, text_data=None):
        # Handle text data (control messages)
        if text_data:
            data = json.loads(text_data)
            if data.get('action') == 'stop_recording':
                # Process final sweep
                final_attributes = await self.process_final_sweep()
                self.final_sweep_completed = True
                
                # Send final results
                await self.send(text_data=json.dumps({
                    "final_results": True,
                    "corrected_audio": self.full_transcript,
                    "attributes": final_attributes
                }))
                return

        # Handle binary data (audio chunks)
        if bytes_data:
            if not self.template:
                # Hard-coded template; ideally, load from your DB.
                self.template = ["name", "to my left", "DOB", "Location", "Place of Birth"]

            # Check if this incoming chunk has a valid WebM header signature.
            if self.webm_header is None and self.check_webm_integrity(bytes_data):
                # Store the entire first chunk as the header.
                self.webm_header = bytes_data
                self.audio_buffer += bytes_data
                print("Stored WebM header from initial chunk.")
            else:
                # For subsequent chunks, if they appear to include a header signature,
                # strip the first 4 bytes (the EBML signature) to avoid duplicate headers.
                if self.check_webm_integrity(bytes_data):
                    print("Detected header in subsequent chunk. Stripping first 4 bytes.")
                    self.audio_buffer += bytes_data[4:]
                else:
                    self.audio_buffer += bytes_data

            self.nchunks += 1

            if self.nchunks >= MIN_CHUNK_NUM:
                # Ensure the aggregated audio starts with a valid header.
                audio_data = self.audio_buffer
                if not self.check_webm_integrity(audio_data) and self.webm_header:
                    audio_data = self.webm_header + audio_data
                    print("Prepended stored header to audio buffer.")

                transcription = await self.run_whisper_on_buffer(audio_data)
                # Parse the transcription and extract attributes.
                fixed_transcript, extracted_attributes = parseTranscribedText(transcription, self.template)

                # Update cumulative transcription.
                self.latest_transcript = fixed_transcript
                self.full_transcript += fixed_transcript

                # Append to the full history (if needed)
                self.all_attributes.append(extracted_attributes)
                # Update the cumulative current attribute dictionary.
                self.current_attributes.update(extracted_attributes)

                # Send the latest transcription and cumulative current attributes.
                await self.send(text_data=json.dumps({
                    "corrected_audio": self.latest_transcript,
                    "attributes": self.current_attributes  # cumulative current attributes
                }))

                # Reset for the next aggregation round.
                self.audio_buffer = b""
                self.nchunks = 0

    async def process_final_sweep(self):
        """
        Process the complete transcript to verify and correct the extracted attributes.
        """
        form = await sync_to_async(Form.objects.get)(id=self.scope['url_route']['kwargs']['formid'])
        
        # Build the field list for the prompt
        field_list = []
        for block in await sync_to_async(list)(form.blocks.all()):
            for field in await sync_to_async(list)(block.fields.all()):
                field_list.append({
                    "block_name": block.block_name,
                    "field_name": field.field_name,
                    "field_type": field.field_type,
                    "current_value": self.current_attributes.get(field.field_name, "N/A")
                })

        prompt = f"""
        You are an AI that extracts and verifies structured data from spoken text. The spoken text may be a conversation between a professional and a client.
        
        Below is a complete transcript and a list of form fields with their current values that were extracted incrementally.
        Please verify these values against the complete transcript and correct any errors. 
        Use the full context of the transcript to ensure accuracy.
        
        If a particular field has a correct value, keep it as is. If it's incorrect or incomplete, provide the correct value.
        If a field truly has no value in the transcript, return 'N/A'.

        Transcript:
        "{self.full_transcript}"

        Current Form Fields with Values:
        {json.dumps(field_list, indent=2)}

        Return a JSON object that maps field names to their final verified values:
        {{
            "Field Name 1": "Verified Value 1",
            "Field Name 2": "Verified Value 2",
            ...
        }}
        """

        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that verifies and corrects extracted data."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2
                )
            )

            ai_response = response.choices[0].message.content

            # Ensure valid JSON output
            verified_attributes = json.loads(ai_response)
            
            print("Final sweep completed. Verified attributes:", verified_attributes)
            return verified_attributes

        except json.JSONDecodeError:
            print("Error: OpenAI API response could not be parsed as JSON.")
            return self.current_attributes  # Return current attributes if parsing fails
        except Exception as e:
            print(f"Error with OpenAI API during final sweep: {e}")
            return self.current_attributes  # Return current attributes if API call fails

    def check_webm_integrity(self, audio_data):
        """
        Checks whether the audio_data starts with the minimal WebM EBML header signature.
        The EBML header for WebM typically starts with the 4-byte sequence: 0x1A45DFA3.
        """
        if len(audio_data) < 4:
            return False
        return audio_data[0:4] == b'\x1A\x45\xDF\xA3'

    async def run_whisper_on_buffer(self, audio_data):
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
            tmp.write(audio_data)
            tmp.flush()
            filename = tmp.name
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, self.call_whisper_api, filename)
        return result.get('text', '')

    def call_whisper_api(self, filename):
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        data = {
            "model": "whisper-1"
        }
        with open(filename, "rb") as f:
            files = {"file": (filename, f, "audio/webm")}
            response = requests.post(WHISPER_API_URL, headers=headers, data=data, files=files)
            print("Sending file with info:", files)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error calling Whisper API: {response.status_code} {response.text}")
            return {"text": ""}

@csrf_exempt
def upload_audio(request, form_id):
    if request.method == "POST" and request.FILES.get("audio"):
        try:
            audio_file = request.FILES["audio"]
            file_path = default_storage.save(f"temp/{audio_file.name}", ContentFile(audio_file.read()))

            wav_path = file_path.replace(".webm", ".wav")
            ffmpeg.input(file_path).output(wav_path, format="wav", acodec="pcm_s16le", ac=1, ar="16000").run()
            
            result = model.transcribe(wav_path)
            transcript = result["text"]
            print("Transcript:", transcript)

            extracted_data = extract_fields(transcript, form_id)
            
            os.remove(file_path)
            os.remove(wav_path)

            return JsonResponse({"transcript": transcript, "fields": extracted_data})

        except Exception as e:
            return JsonResponse({"error": f"Processing failed: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def extract_fields(transcript, form_id):
    """
    Extracts values from the transcript using OpenAI's API.
    If the AI is unsure about a field, it returns 'N/A'.
    """

    # Get the form structure (blocks and fields)
    form = Form.objects.get(id=form_id)
    
    # Build the prompt to send to OpenAI
    field_list = []
    for block in form.blocks.all():
        for field in block.fields.all():
            field_list.append({"block_name": block.block_name, "field_name": field.field_name, "field_type": field.field_type})

    prompt = f"""
    You are an AI that extracts structured data from spoken text. The spoken text may be a conversation between a professional and a client, so ensure you extract the client's information for the data. 
    Given the transcript and form fields below, extract relevant values. If a field is missing or unclear, return 'N/A'. Maintain structure.
    If a particular field has an expected structure, try to match that structure with the extracted value if it exists. The transcript may have slightly incorrect pieces, so use the context to help you correct certain fields. Do not change fields that are correct.

    Transcript:
    "{transcript}"

    Form Fields:
    {json.dumps(field_list, indent=2)}

    Return a JSON object in this format:
    [
        {{
            "block_name": "Patient Information",
            "fields": [
                {{"field_name": "Full Name", "field_type": "text", "value": "John Doe"}},
                {{"field_name": "Date of Birth", "field_type": "date", "value": "1990-01-12"}}
            ]
        }},
        {{
            "block_name": "Medical History",
            "fields": [
                {{"field_name": "Allergies", "field_type": "textarea", "value": "N/A"}},
                {{"field_name": "Medications", "field_type": "textarea", "value": "N/A"}}
            ]
        }}
    ]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts structured data."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        ai_response = response.choices[0].message.content

        # Ensure valid JSON output
        extracted_fields = json.loads(ai_response)

        # Ensure that all fields in the form are present, adding "N/A" where necessary
        structured_response = []
        for block in form.blocks.all():
            block_data = {"block_name": block.block_name, "fields": []}

            for field in block.fields.all():
                # Find field in AI response
                found_field = next(
                    (f for b in extracted_fields if b["block_name"] == block.block_name 
                     for f in b["fields"] if f["field_name"] == field.field_name),
                    None
                )
                # If AI didn't extract it, return "N/A"
                extracted_value = found_field["value"] if found_field else "N/A"

                block_data["fields"].append({
                    "field_name": field.field_name,
                    "field_type": field.field_type,
                    "value": extracted_value
                })

            structured_response.append(block_data)

        return structured_response

    except json.JSONDecodeError:
        print("Error: OpenAI API response could not be parsed as JSON.")
        return []
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return []

class FormDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, form_id, format=None):
        try:
            # Ensure that the user can only access their own forms
            form = Form.objects.get(id=form_id, user=request.user)
        except Form.DoesNotExist:
            return Response({"detail": "Form not found."}, status=404)
        serializer = FormDetailSerializer(form)
        return Response(serializer.data)

class FormListView(ListAPIView):
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Form.objects.filter(user=self.request.user)  # Only return forms created by the logged-in user

class FormCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def post(self, request):
        """Create a new form along with its blocks and fields"""
        if request.user.is_anonymous:
            return Response({"error": "User is not authenticated"}, status=401)

        serializer = FormSerializer(data=request.data)
        if serializer.is_valid():
            form = serializer.save(user=request.user)  # Attach authenticated user
            return Response(FormSerializer(form).data, status=201)

        return Response(serializer.errors, status=400)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to register

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "User created successfully. Await activation.", "token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to log in

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Retrieve the user using email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Manually check the password instead of using authenticate()
        if check_password(password, user.password):  # Compare hashed password
            if not user.is_active:
                return Response({"error": "Account is inactive. Please wait for activation."}, status=status.HTTP_403_FORBIDDEN)

            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

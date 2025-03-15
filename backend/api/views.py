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

model = whisper.load_model("base")
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

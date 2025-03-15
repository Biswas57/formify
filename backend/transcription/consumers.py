import json, tempfile, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from parsing.groq_parse import parseTranscribedText
import whisper

# Load the Whisper model (choose the appropriate model size for your needs)
model = whisper.load_model("base")

# Adjust this threshold based on testing and your audio format (in bytes)
MIN_AUDIO_CHUNK_SIZE = 50000

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.audio_buffer = b""

    async def disconnect(self, close_code):
        transcription = await self.run_whisper_on_buffer(self.audio_buffer)
        await self.send(text_data=json.dumps({
            "transcription": transcription
        }))
        pass

    async def receive(self, bytes_data=None, text_data=None):
        if bytes_data:
            self.audio_buffer += bytes_data
            # When enough audio data has accumulated, process it
            if len(self.audio_buffer) >= MIN_AUDIO_CHUNK_SIZE:
                transcription = await self.run_whisper_on_buffer(self.audio_buffer)
                attributes = ["name", "to my left"]

                fixed_audio, attribute_final = parseTranscribedText(transcription, attributes)
                await self.send(text_data=json.dumps({
                    "correct_audio": fixed_audio,
                    "attributes" : attribute_final
                }))
                # Reset or adjust the buffer as needed (e.g., clear or overlap)
                self.audio_buffer = b""

    async def run_whisper_on_buffer(self, audio_data):
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_data)
            tmp.flush()
            filename = tmp.name
        # Offload transcription to a thread to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, model.transcribe, filename)
        return result.get('text', '')

import io
import json
import asyncio
import whisper
import numpy as np
import ffmpeg
import soundfile as sf
from channels.generic.websocket import AsyncWebsocketConsumer

# Load Whisper once globally
model = whisper.load_model("base")

class RecordConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connected")
        self.audio_buffer = bytearray()
        self.processing = False  # Prevent multiple transcription tasks at the same time

    async def disconnect(self, close_code):
        print("WebSocket disconnected")

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            try:
                data = json.loads(text_data)
                if "stop" in data and data["stop"] == True:
                    print("Recording stopped. Resetting buffer.")
                    self.audio_buffer = bytearray()  # Clear the buffer
                    return
            except json.JSONDecodeError:
                pass  # Ignore invalid JSON messages
        
        if bytes_data:
            self.audio_buffer.extend(bytes_data)
            print(f"Buffer size: {len(self.audio_buffer)}")

    async def transcribe_buffer(self):
        """Run transcription asynchronously to avoid blocking the WebSocket"""
        loop = asyncio.get_event_loop()
        transcript = await loop.run_in_executor(None, self.run_whisper_transcription, self.audio_buffer)
        print("Transcript:", transcript)
        return transcript

    def run_whisper_transcription(self, audio_bytes):
        """Convert WebM audio to WAV and transcribe using Whisper"""
        try:
            # Convert raw audio to WAV using ffmpeg
            audio_input = io.BytesIO(audio_bytes)
            audio_output = io.BytesIO()

            process = (
                ffmpeg.input("pipe:0")
                .output("pipe:1", format="wav", acodec="pcm_s16le", ac=1, ar="16000")
                .run_async(pipe_stdin=True, pipe_stdout=True, pipe_stderr=True)
            )

            wav_data, _ = process.communicate(audio_input.read())
            audio_output.write(wav_data)
            audio_output.seek(0)

            # Read WAV file
            audio_np, samplerate = sf.read(audio_output, dtype="float32")

            # Transcribe with Whisper
            result = model.transcribe(audio_np, language="en")  # Force English
            return result.get("text", "")

        except Exception as e:
            print("Error processing audio:", e)
            return "Transcription error"

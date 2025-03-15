from django.urls import path
from .consumers import TranscriptionConsumer

websocket_urlpatterns = [
    path("ws/transcription/", TranscriptionConsumer.as_asgi()),  # Ensure this matches the frontend URL
]

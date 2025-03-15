from django.urls import path
from .views import TranscriptionConsumer

websocket_urlpatterns = [
    path("ws/transcription/", TranscriptionConsumer.as_asgi()),  # Ensure this matches the frontend URL
]

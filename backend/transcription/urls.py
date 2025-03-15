from django.urls import path
from .consumers import TranscriptionConsumer

urlpatterns = [
    path("ws/transcription/", TranscriptionConsumer.as_asgi()),
]

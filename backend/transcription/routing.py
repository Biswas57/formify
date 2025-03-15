from django.urls import re_path
from .consumers import TranscriptionConsumer

websocket_urlpatterns = [
    re_path(r'^ws/transcribe/$', TranscriptionConsumer.as_asgi()),
]

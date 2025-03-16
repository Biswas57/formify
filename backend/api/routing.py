from django.urls import re_path
from .views import TranscriptionConsumer

websocket_urlpatterns = [
    re_path(r'^ws/transcription/(?P<formid>\w+)/$', TranscriptionConsumer.as_asgi()),  # Ensure this matches the frontend URL
]
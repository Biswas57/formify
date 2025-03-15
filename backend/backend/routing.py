from django.urls import path
from api import consumers  # "api" is your Django app where the consumer is implemented

websocket_urlpatterns = [
    path("ws/record/", consumers.RecordConsumer.as_asgi()),
]

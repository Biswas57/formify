import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import your WebSocket routing from api/routing.py
from api import routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handle HTTP requests.
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns  # Routes for WebSocket connections.
        )
    ),
})

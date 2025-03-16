import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.staticfiles import StaticFilesWrapper  # Import the static files wrapper

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import your WebSocket routing
from api import routing

application = ProtocolTypeRouter({
    "http": StaticFilesWrapper(get_asgi_application()),  # Wrap the HTTP application
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns  # Your WebSocket routes
        )
    ),
})

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator 
from chat.routing import websocket_urlpatterns
from game.routing import websocket_urlpatterns as game_websocket_urlpatterns

from .middleware import JwtAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back_trans_proj.settings')

all_websocket_urlpatterns = game_websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        JwtAuthMiddleware(
            URLRouter(all_websocket_urlpatterns)
        )
    ),
})

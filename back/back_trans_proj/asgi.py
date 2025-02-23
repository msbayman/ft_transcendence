import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator 
from chat.routing import websocket_urlpatterns as chat_websocket_urlpatterns
from game.routing import websocket_urlpatterns as game_websocket_urlpatterns
from django.urls import re_path

from .middleware import JwtAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back_trans_proj.settings')

all_websocket_urlpatterns = chat_websocket_urlpatterns + game_websocket_urlpatterns


async def unmatched_route(scope, receive, send):
    await send(
        {
            "type": "websocket.close",
            "code": 4404,
        }
    )

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        JwtAuthMiddleware(
            URLRouter([*chat_websocket_urlpatterns, *game_websocket_urlpatterns, re_path(r'', unmatched_route)])
        )
    ),
})
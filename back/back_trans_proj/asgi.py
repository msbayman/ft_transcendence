"""
ASGI config for back_trans_proj project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back_trans_proj.settings')

django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from game.routing import websocket_urlpatterns
import game.routing 
from back_trans_proj.middleware import JwtAuthMiddlewareOk
from channels.security.websocket import AllowedHostsOriginValidator


print('api ==> asgi.py: get_asgi_application()')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddlewareOk(
        URLRouter(
            game.routing.websocket_urlpatterns,
        )
    ),
})

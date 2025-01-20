from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/$', consumers.NotifConsumer.as_asgi()),
    # re_path(r'ws/users/$', consumers.UserListConsumer.as_asgi()),
]
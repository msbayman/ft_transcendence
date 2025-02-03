from django.urls import re_path
from . import consumers
from . import notification_consumer 

websocket_urlpatterns = [
    re_path(r'ws/chat/?$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/notifications/?$', notification_consumer.NotifConsumer.as_asgi()),
]
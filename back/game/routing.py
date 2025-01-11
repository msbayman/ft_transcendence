from django.urls import re_path,path
from .gameconsumers import GameConsumer
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<room_name>\w+)/$', GameConsumer.as_asgi()), 
    re_path(r'^ws/matchmaking/', consumers.MatchMakingConsumer.as_asgi()),
]

from django.urls import re_path,path
from .gameconsumers import GameConsumer
from .tournconsumer import TournConsumer
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<id>[\w_]+)/$', GameConsumer.as_asgi()),
    re_path(r'^ws/matchmaking/', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'^ws/challenge/(?P<id>[\w\-\+]+)/$', consumers.ChalleConsumer.as_asgi()),
]

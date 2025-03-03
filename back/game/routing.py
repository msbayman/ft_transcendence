from django.urls import re_path,path
from .gameconsumers import GameConsumer
from .rps import Rps



from .tournconsumer import TournConsumer
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<id>[\w_]+)/$', GameConsumer.as_asgi()),
    re_path(r'ws/rsp/(?P<id>[\w_]+)/$', Rps.as_asgi()),
    re_path(r'^ws/matchmaking/', consumers.MatchMakingConsumer.as_asgi()),
    re_path(r'^ws/matchmaking_sg/?$', consumers.SgMatchMakingConsumer.as_asgi()),
    re_path(r'^ws/challenge/(?P<id>[\w\-\+]+)/$', consumers.ChalleConsumer.as_asgi()),
]

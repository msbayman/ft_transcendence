from django.urls import path
from .views import get_players
from .views import post_username_for_players
from .views import get_username_for_players

urlpatterns = [
    path('getplydata/', get_players, name='data_api'),
    path('getdata/', get_username_for_players, name='api'),
    path('postdata/', post_username_for_players, name='post_api'),
]
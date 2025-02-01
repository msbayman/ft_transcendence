from django.urls import path
from .views import get_players
from .views import post_username_for_players
from .views import get_username_for_players
from . import views

urlpatterns = [
    path('getplydata/', get_players, name='data_api'),
    path('getdata/', get_username_for_players, name='api'),
    path('postdata/', post_username_for_players, name='post_api'),
    path('get_match/<str:username>/', views.UserMatchHistoryView.as_view(), name='history'),
    path('last_5_days/<str:username>/', views.Last_5_Days.as_view(), name='last-5-days'),
]
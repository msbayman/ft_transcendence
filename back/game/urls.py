from django.urls import path
from .views import get_players
from .views import post_username_for_players
from .views import get_username_for_players
from . import views

urlpatterns = [
    path('get_match/<str:username>/', views.UserMatchHistoryView.as_view(), name='history'),
]
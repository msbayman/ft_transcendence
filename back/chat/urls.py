from django.urls import path
from . import views

urlpatterns = [
    path('chat/<str:username>/', views.chat_view, name='chat'),
    path('users/', views.user_list_view, name='user_list'),
]
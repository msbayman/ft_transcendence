from django.urls import path
from . import views
from .views import user_list_view

urlpatterns = [
    path('chat/<str:username>/', views.chat_view, name='chat'),
    # path('users/', views.user_list_view, name='user_list'),
    path('api/users/', user_list_view, name='user-list-api'),
    # path('api/users/', user_list_view, name='user-list-api'),
]

from django.urls import path
from . import views
from .views import user_list_view
from .views import LastMessageView
from .views import TestAuthView
from .views import GetConversation

urlpatterns = [
    path('chat/<str:username>/', views.chat_view, name='chat'),
    # path('users/', views.user_list_view, name='user_list'),
    path('api/users/', user_list_view, name='user-list-api'),
    path('last-message/', LastMessageView.as_view(), name='last-message'),
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
    path('getconversation/', GetConversation.as_view(), name='getconversation'),
    # path('api/users/', user_list_view, name='user-list-api'),
]

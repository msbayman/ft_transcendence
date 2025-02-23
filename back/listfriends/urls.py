from django.urls import path
from . import views

urlpatterns = [
    path('send-friend-request/<str:username>/', views.SendFriendRequest.as_view(), name='send_friend_request'),
    path('accept-friend-request/<str:username>/', views.AcceptFriendRequest.as_view(), name='accept_friend_request'),
    path('check-friend-requests/<str:username>/', views.CheckFriendRequest.as_view(), name='check_friend_requests'),
    path('decline-friend-requests/<str:username>/', views.DeclineFriendRequest.as_view(), name='decline_friend_requests'),
    path('list-all-friend-requests/', views.list_all_friend_requests, name='list_all_friend_requests'),
]
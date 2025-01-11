from django.urls import path
from . import views

urlpatterns = [
    # path('send_to_friend/<str:username>', views.send_to_friend.as_view(), name='send_to_friend'),
     path('send_to_friend/<str:username>/', views.send_to_friend.as_view(), name='send_to_friend'),
    path('accept_tobe_friend/<str:username>/', views.accept_tobe_friend.as_view(), name='accept_tobe_friend'),
]
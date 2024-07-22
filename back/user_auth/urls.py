from django.urls import path
from . import views

urlpatterns = [
     path("", views.index, name="index"),
     path("display_users", views.display_users, name="display_users"),
     path('add_player', views.add_player, name='add_player'),
     path('delete_player', views.delete_player, name='delete_player'),
     path('update_player', views.update_player, name='update_player'),
     path('login_player', views.LoginAPIView.as_view(), name='login_player'),
]
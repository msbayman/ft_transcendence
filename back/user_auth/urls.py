from django.urls import path
from . import views
from .import otp_view
urlpatterns = [
     path("", views.index, name="index"),
     path("display_users", views.display_users, name="display_users"),
     path('add_player', views.add_player, name='add_player'),
     path('delete_player', views.delete_player, name='delete_player'),
     path('update_player', views.update_player, name='update_player'),
     path('login_simple', views.LoginAPIView.as_view(), name='login_simple'),
     # path('send-otp', views.SendOTPView.as_view(), name='send-otp'),
     path('VerifyOTP', views.VerifyOTP.as_view(), name='VerifyOTP'),
     path('UserDetailView', views.UserDetailView.as_view(), name='UserDetailView'),
     path("make_req_otp/<str:email_to_send>/", otp_view.send_otp_via_email, name="make_req_otp"),
]
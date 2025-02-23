from django.urls import path
from . import views 
from .import otp_view
urlpatterns = [
     # path("", views.index, name="index"),
     path('display_users', views.display_users, name='display_users'),
     # path('list_users', views.list_users, name='list_users'),
     path('add_player', views.add_player, name='add_player'),
     # path('delete_player', views.delete_player, name='delete_player'),
     path('update_player', views.update_player, name='update_player'),
     path('login_simple', views.LoginAPIView.as_view(), name='login_simple'),
     # path('send-otp', views.SendOTPView.as_view(), name='send-otp'),
     path('VerifyOTP', views.VerifyOTP.as_view(), name='VerifyOTP'),
     path('SendOtpForSettings', views.SendOtpForSettings.as_view(), name='SendOtpForSettings'),
	path('VerifyOTPSettings', views.VerifyOTPSettings.as_view(), name='VerifyOTPSettings'),
     path('UserDetailView', views.UserDetailView.as_view(), name='UserDetailView'),
     # path("make_req_otp/<str:email_to_send>/", otp_view.send_otp_via_email, name="make_req_otp"),
     path('leaderboard/', views.leaderboard, name='leaderboard'),
     path('is_online/', views.is_online.as_view(), name='is_online'),
     path('get-player/<str:username>/', views.GetPlayer.as_view(), name='get-player'),
     path('LogoutAPIView/', views.LogoutAPIView.as_view(), name='LogoutAPIView'),
     path('search-users/', views.SearchUser.as_view(), name='search_users'),
     path('changePassword', views.changePassword, name='changePassword'),
     # path('', views.resend_otp, name='resend_otp'),
     # path('UpdatePass/', views.UpdatePass.as_view(), name='UpdatePass'),
     path('upload_profile_image', views.upload_profile_image, name='upload_profile_image'),
     # path('change_cover', views.change_cover, name='change_cover'),
     path('changePassword', views.changePassword, name='changePassword'),
     path('get2FAStatus', views.get_2fa_status, name='get_2fa_status'),

     # path('health_check',  views.health_check, name='health_check'),  # Use a trailing slash
     # path('health_check',  views.health_check, name='health_check'),  # Use a trailing slash
]
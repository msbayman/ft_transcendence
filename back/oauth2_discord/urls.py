from django.urls import path
from . import views
from . import otp_view

urlpatterns = [
    path("login",views.login,name="login"),
    path("login_redirect",views.login_redirect,name="login_redirect"),
    path("make_req_otp/<str:email_to_send>/", otp_view.send_otp_email, name="make_req_otp"),
]
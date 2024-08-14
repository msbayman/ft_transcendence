from django.urls import path
from . import views

urlpatterns = [
     path("home", views.home, name="home"),
     path("login",views.login,name="login"),
    path("login_redirect",views.login_redirect,name="login_redirect"),
]
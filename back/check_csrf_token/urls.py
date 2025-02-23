from django.urls import path
from . import views

urlpatterns = [
    path("validate_token",views.validate_token,name="validate_token"),
]
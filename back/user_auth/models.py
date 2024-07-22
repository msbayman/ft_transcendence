from django.db import models
from django.contrib.auth.models import AbstractUser

class Player(AbstractUser):
    full_name = models.CharField(max_length=30)
    username = models.CharField(max_length=100 ,unique=True)
    email = models.EmailField( unique=True)
    password = models.CharField(max_length=30)
    re_password = models.CharField(max_length=30)
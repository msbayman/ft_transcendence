from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class Player(AbstractUser):
    full_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    id_prov = models.CharField(max_length=40, blank=True, null=True)
    prov_name = models.CharField(max_length=30, blank=True, null=True)
    provider_identifier = models.CharField(max_length=100, blank=True, null=True)
    otp_code = models.CharField(max_length=6,blank=True)  # OTP code
    created_at = models.DateTimeField(auto_now_add=True)  # Time when the OTP was created
    active_2fa = models.BooleanField(default=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def save(self, *args, **kwargs):
        # Convert empty strings to None before saving
        if self.id_prov == "":
            self.id_prov = None
        if self.prov_name == "":
            self.prov_name = None
        
        if self.prov_name and self.id_prov:
            self.provider_identifier = f"{self.prov_name}//{self.id_prov}"
        else:
            self.provider_identifier = None
        
        super().save(*args, **kwargs)

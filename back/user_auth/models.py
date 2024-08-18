from django.db import models
from django.contrib.auth.models import AbstractUser

class Player(AbstractUser):
    full_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    id_prov = models.CharField(max_length=40, blank=True, null=True)
    prov_name = models.CharField(max_length=30, blank=True, null=True)
    provider_identifier = models.CharField(max_length=100, blank=True, null=True)

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

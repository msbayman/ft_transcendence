# from django.contrib.auth.models import AbstractUser
# from django.db import models

# class Player(AbstractUser):
#     username = models.CharField(max_length=100, primary_key=True)
#     full_name = models.CharField(max_length=30)
#     email = models.EmailField(unique=True)
#     id_prov = models.CharField(max_length=40, blank=True, null=True)
#     prov_name = models.CharField(max_length=30, blank=True, null=True)
#     provider_identifier = models.CharField(max_length=100, blank=True, null=True)
    

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=['id_prov', 'prov_name'],
#                 name='unique_provider_user'
#             )
#         ]

#     def save(self, *args, **kwargs):
#         if self.prov_name and self.id_prov:
#             self.provider_identifier = f"{self.prov_name}//{self.id_prov}"
#         else:
#             self.provider_identifier = None
#         super().save(*args, **kwargs)

from django.contrib.auth.models import AbstractUser
from django.db import models

class Player(AbstractUser):
    full_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    id_prov = models.CharField(max_length=40, blank=True, null=True)
    prov_name = models.CharField(max_length=30, blank=True, null=True)
    provider_identifier = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['id_prov', 'prov_name'],
                name='unique_provider_user'
            )
        ]

    def save(self, *args, **kwargs):
        if self.prov_name and self.id_prov:
            self.provider_identifier = f"{self.prov_name}//{self.id_prov}"
        else:
            self.provider_identifier = None
        super().save(*args, **kwargs)

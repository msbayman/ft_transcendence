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
    active_2fa = models.BooleanField(default=True)  # 2FA status
    is_validate = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default_profile.jpeg')
    cover_image = models.ImageField(upload_to='cover_pictures/', default='cover_pictures/Cover_Picture_1.png')
    points = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)
    level = models.IntegerField(default=0)
    total_games = models.IntegerField(default=0)
    win_games = models.IntegerField(default=0)
    lose_games = models.IntegerField(default=0)
    list_users_friends = models.ManyToManyField('self', blank=True)
    blocked_users = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='blocked_by',
        blank=True,
    )
    def block_user(self, user):
        if user != self:
            self.blocked_users.add(user)

    def unblock_user(self, user):
        self.blocked_users.remove(user)

    def is_blocked(self, user):
        return self.blocked_users.filter(pk=user.pk).exists()
        
    ####################################################################

    win_1_game = models.BooleanField(default=False)
    win_3_games = models.BooleanField(default=False)
    win_10_games = models.BooleanField(default=False)
    win_30_games = models.BooleanField(default=False)
    reach_level_5 = models.BooleanField(default=False)
    reach_level_15 = models.BooleanField(default=False)
    reach_level_30 = models.BooleanField(default=False)
    perfect_win_game = models.BooleanField(default=False)
    perfect_win_tournaments = models.BooleanField(default=False)



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

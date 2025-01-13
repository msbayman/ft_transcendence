from django.db import models
from django.conf import settings
from django.utils import timezone
from user_auth.models import Player

# Create your models here.


class Friend_request(models.Model):
    my_user         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sent_requests')
    other_user      = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='received_requests')

    STATUS_CHOICES  = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
    ]

    states          = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Friend request from {self.my_user.username} to {self.other_user.username}"
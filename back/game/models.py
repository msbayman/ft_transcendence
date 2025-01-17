from django.db import models

class Match(models.Model):
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    player1_score = models.PositiveIntegerField(default=0)
    player2_score = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

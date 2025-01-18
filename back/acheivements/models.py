from django.db import models
from user_auth.models import Player

# Create your models here.


# class Achievements(models.Model):
#     user = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="Achievements")
#     win_1_game = models.BooleanField(default=False)
#     win_3_games = models.BooleanField(default=False)
#     win_10_games = models.BooleanField(default=False)
#     win_20_games = models.BooleanField(default=False)
#     reach_level_5 = models.BooleanField(default=False)
#     reach_level_15 = models.BooleanField(default=False)
#     reach_level_30 = models.BooleanField(default=False)
#     perfect_win_game = models.BooleanField(default=False)
#     perfect_win_tournaments = models.BooleanField(default=False)

#     def __str__(self):
#         return f"the achievements will be assigned to {self.user}"
    
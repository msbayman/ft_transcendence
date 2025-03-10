from django.db import models

# status {
    # 0 => panding
    # 1 => in game
    # 2 => end game
# }

class Match(models.Model):
    game_type = models.BooleanField(default=False)
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    player1_score = models.PositiveIntegerField(default=0)
    player2_score = models.PositiveIntegerField(default=0)
    status = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)


class Tourn(models.Model):
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    player3 = models.CharField(max_length=100)
    player4 = models.CharField(max_length=100)
    semi1 = models.CharField(max_length=100, null=True, blank=True);
    semi2 = models.CharField(max_length=100, null=True, blank=True);
    final = models.CharField(max_length=100, null=True, blank=True);

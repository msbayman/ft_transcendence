# Generated by Django 4.2.13 on 2025-01-10 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0013_player_lose_games_player_total_games_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='level',
            field=models.IntegerField(default=1),
        ),
    ]

# Generated by Django 4.2.13 on 2025-01-13 16:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0016_remove_player_list_users_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='list_users_friends',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]

# Generated by Django 4.2.13 on 2025-01-13 16:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0015_player_list_users_friends'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='list_users_friends',
        ),
    ]

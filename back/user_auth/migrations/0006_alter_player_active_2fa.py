# Generated by Django 4.2.13 on 2024-08-28 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0005_alter_player_active_2fa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='active_2fa',
            field=models.BooleanField(default=True),
        ),
    ]

# Generated by Django 4.2.13 on 2025-01-05 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0007_player_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='cover_image',
            field=models.ImageField(default='cover_pictures/Cover_Picture_1.png', upload_to='cover_pictures/'),
        ),
        migrations.AlterField(
            model_name='player',
            name='profile_image',
            field=models.ImageField(default='profile_images/default_profile.jpeg', upload_to='profile_images/'),
        ),
    ]

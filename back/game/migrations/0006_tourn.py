# Generated by Django 4.2.13 on 2025-01-25 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0005_remove_match_winner_match_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tourn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1', models.CharField(max_length=100)),
                ('player2', models.CharField(max_length=100)),
                ('player3', models.CharField(max_length=100)),
                ('player4', models.CharField(max_length=100)),
                ('semi1', models.CharField(max_length=100)),
                ('final', models.CharField(max_length=100)),
            ],
        ),
    ]

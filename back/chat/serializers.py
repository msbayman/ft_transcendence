from rest_framework import serializers
from user_auth.models import Player  # Import the Player model

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player  # Use the custom Player model
        fields = ['id', 'username', 'email', 'full_name', 'active_2fa']  # Include any fields you need

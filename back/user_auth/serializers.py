from rest_framework import serializers
from .models import Player
import re

class PlayerSerializer(serializers.ModelSerializer):
    re_password = serializers.CharField(write_only=True)

    class Meta:
        model = Player
        fields = ['full_name', 'username', 'email', 'password', 're_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_full_name(self, value):
        if not re.match(r'^[a-zA-Z ]+$', value):
            raise serializers.ValidationError("Full name must contain only letters and spaces.")
        if not (7 <= len(value) <= 30):
            raise serializers.ValidationError("Full name length must be between 7 and 30 characters.")
        return value

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z0-9-_]+$', value):
            raise serializers.ValidationError("Username must contain only letters, numbers, hyphens, and underscores.")
        if not (3 <= len(value) <= 15):
            raise serializers.ValidationError("Username length must be between 3 and 15 characters.")
        return value

    def validate(self, data):
        if data['password'] != data['re_password']:
            raise serializers.ValidationError("Passwords do not match.")
        if not (6 <= len(data['password']) <= 30):
            raise serializers.ValidationError("Password length must be between 6 and 30 characters.")
        return data

    def create(self, validated_data):
        validated_data.pop('re_password')  # Remove re_password since it is not needed for Player creation
        player = Player(
            full_name=validated_data['full_name'],
            username=validated_data['username'],
            email=validated_data['email'],
        )
        player.set_password(validated_data['password'])
        player.save()
        return player

    # def update(self, instance, validated_data):
    #     validated_data.pop('re_password', None)  # Remove re_password since it is not needed for Player update
        
    #     instance.full_name = validated_data.get('full_name', instance.full_name)
    #     instance.username = validated_data.get('username', instance.username)
    #     instance.email = validated_data.get('email', instance.email)
        
    #     password = validated_data.get('password', None)
    #     if password:
    #         instance.set_password(password)

    #     instance.save()
    #     return instance

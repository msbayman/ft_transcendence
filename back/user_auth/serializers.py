from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Player
import re

class PlayerSerializer(serializers.ModelSerializer):
    re_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Player
        fields = ['full_name', 'username', 'email', 'password', 're_password', 'id_prov', 'prov_name', 'provider_identifier']
        extra_kwargs = {
            'password': {'write_only': True},
            're_password': {'write_only': True},
            'username': {'required': True},
            'id_prov': {'write_only': True, 'required': False},
            'prov_name': {'write_only': True, 'required': False},
            'provider_identifier': {'read_only': True},  # Read-only since it's auto-generated
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

    def validate_email(self, value):
        if Player.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, data):
        # Ensure that passwords match if provided
        if 'password' in data and 're_password' in data:
            if data['password'] != data['re_password']:
                raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('re_password', None)
        is_oauth = 'id_prov' in validated_data and 'prov_name' in validated_data

        if is_oauth:
            # Handle OAuth case
            base_username = validated_data.get('username', None)
            username = base_username
            counter = 1

            # Keep appending symbols until the username is unique
            while Player.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            player = Player(
                full_name=validated_data['full_name'],
                email=validated_data['email'],
                id_prov=validated_data['id_prov'],
                prov_name=validated_data['prov_name'],
                username=username
            )
            player.set_unusable_password()
        else:
            # Handle traditional sign-up case
            player = Player(
                full_name=validated_data['full_name'],
                username=validated_data['username'],
                email=validated_data['email']
            )
            player.set_password(validated_data['password'])
        
        player.save()
        return player

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.email = validated_data.get('email', instance.email)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance

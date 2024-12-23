from rest_framework import serializers
from .models import Player
import re

class PlayerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    re_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Player
        fields = [
            'username', 'full_name', 'email', 'password', 
            're_password', 'id_prov', 'prov_name', 'provider_identifier'
        ]
        extra_kwargs = {
            'username': {'required': True},
            'id_prov': {'required': False},
            'prov_name': {'required': False},
            'provider_identifier': {'read_only': True},
        }

    def validate_full_name(self, value):
        # Full name validation: 2-40 characters, only letters and spaces
        if not re.match(r'^[a-zA-Z ]+$', value):
            raise serializers.ValidationError("Full name must contain only letters and spaces.")
        if not (2 <= len(value) <= 40):
            raise serializers.ValidationError("Full name length must be between 7 and 30 characters.")
        return value

    def validate_username(self, value):
        # Username validation: 2-40 characters, only letters, numbers, hyphens, and underscores
        if not re.match(r'^[a-zA-Z0-9-_]+$', value):
            raise serializers.ValidationError("Username must contain only letters, numbers, hyphens, and underscores.")
        if 2 <= len(value) <= 40:
            return value
        elif prov_name == "Discord" or prov_name == "42":
            return value
        else:
            raise serializers.ValidationError("Username length must be between 3 and 15 characters.")


    def validate_password(self, value):
        # Password validation: 2-40 characters
        if not (2 <= len(value) <= 40):
            raise serializers.ValidationError("Password length must be between 6 and 30 characters.")
        return value

    def validate(self, data):
        # Convert empty strings to None
        data['id_prov'] = data.get('id_prov') or None
        data['prov_name'] = data.get('prov_name') or None

        # Enforce uniqueness only when both id_prov and prov_name are provided
        if data['id_prov'] and data['prov_name']:
            if Player.objects.filter(id_prov=data['id_prov'], prov_name=data['prov_name']).exists():
                raise serializers.ValidationError(
                    {"non_field_errors": "A user with this provider ID already exists."}
                )

        # Ensure passwords match
        if 'password' in data and 're_password' in data:
            if data['password'] != data['re_password']:
                raise serializers.ValidationError({"re_password": "Passwords do not match."})

        return data

    def create(self, validated_data):
        validated_data.pop('re_password', None)
        is_oauth = 'prov_name' in validated_data and validated_data['prov_name']

        if is_oauth:
            player = self.get_or_create_oauth_user(validated_data)
        else:
            player = self.create_traditional_user(validated_data)

        return player

    def get_or_create_oauth_user(self, validated_data):
        email = validated_data.get('email')
        id_prov = validated_data.get('id_prov')
        prov_name = validated_data.get('prov_name')

        player, created = Player.objects.get_or_create(
            email=email,
            defaults={
                'username': self.generate_unique_username(validated_data.get('username', '')),
                'full_name': validated_data.get('full_name', ''),
                'id_prov': id_prov,
                'prov_name': prov_name,
            }
        )

        if not created:
            player.id_prov = id_prov
            player.prov_name = prov_name
            player.full_name = validated_data.get('full_name', player.full_name)
            player.save()

        return player

    def create_traditional_user(self, validated_data):
        validated_data.pop('re_password', None)
        password = validated_data.pop('password')
        player = Player(**validated_data)
        player.set_password(password)
        player.save()
        return player

    def generate_unique_username(self, base_username):
        username = base_username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        return username

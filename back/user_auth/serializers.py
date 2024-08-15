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
            'password': {'write_only': True, 'required': False},
            're_password': {'write_only': True, 'required': False},
            'username': {'required': False},
            'id_prov': {'write_only': True, 'required': False},
            'prov_name': {'write_only': True, 'required': False},
            'provider_identifier': {'read_only': True},
        }

    def validate(self, data):
        if 'prov_name' not in data:  # Traditional sign-up
            if not data.get('password'):
                raise serializers.ValidationError("Password is required for traditional sign-up.")
            if data.get('password') != data.get('re_password'):
                raise serializers.ValidationError("Passwords do not match.")
            self.validate_traditional_fields(data)
        return data

    def validate_traditional_fields(self, data):
        full_name = data.get('full_name', '')
        username = data.get('username', '')

        if not re.match(r'^[a-zA-Z ]{7,30}$', full_name):
            raise serializers.ValidationError("Full name must be 7-30 characters long and contain only letters and spaces.")

        if not re.match(r'^[a-zA-Z0-9-_]{3,15}$', username):
            raise serializers.ValidationError("Username must be 3-15 characters long and contain only letters, numbers, hyphens, and underscores.")

        if Player.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError("A user with this email already exists.")

    def create(self, validated_data):
        is_oauth = 'prov_name' in validated_data

        if is_oauth:
            return self.create_or_update_oauth_user(validated_data)
        else:
            return self.create_traditional_user(validated_data)

    def create_or_update_oauth_user(self, validated_data):
        email = validated_data['email']
        id_prov = validated_data['id_prov']
        prov_name = validated_data['prov_name']

        # Check if user already exists by email or id_prov
        existing_user = Player.objects.filter(email=email).first() or Player.objects.filter(id_prov=id_prov, prov_name=prov_name).first()
        
        if existing_user:
            # Update existing user with OAuth info
            existing_user.id_prov = id_prov
            existing_user.prov_name = prov_name
            existing_user.full_name = validated_data.get('full_name', existing_user.full_name)
            existing_user.save()
            return existing_user

        # Create new user
        username = self.generate_unique_username(validated_data.get('username', ''))
        player = Player(
            full_name=validated_data.get('full_name', ''),
            email=email,
            username=username,
            id_prov=id_prov,
            prov_name=prov_name
        )
        player.set_unusable_password()
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

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance
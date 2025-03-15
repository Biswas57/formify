from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]

    def validate(self, data):
        """Ensure passwords match"""
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        """Create a new user with encrypted password"""
        validated_data.pop("password2")  # Remove password2 from validated data
        user = User.objects.create_user(**validated_data)
        user.is_staff = False  # Ensure user is never staff
        user.is_active = True  # Ensure user is not active by default
        user.save()
        return user
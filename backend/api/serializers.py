from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Form, Block, Field

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'field_name', 'field_type']

class BlockSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True)  # Include nested fields

    class Meta:
        model = Block
        fields = ["id", "block_name", "fields"]
        
class FormDetailSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True, read_only=True)
    
    class Meta:
        model = Form
        fields = ['id', 'form_name', 'blocks']

class FormSerializer(serializers.ModelSerializer):
    blocks = BlockSerializer(many=True)  # Include nested blocks

    class Meta:
        model = Form
        fields = ["id", "form_name", "blocks"]

    def create(self, validated_data):
        """Override create() to handle nested data"""
        blocks_data = validated_data.pop("blocks")
        form = Form.objects.create(**validated_data)

        for block_data in blocks_data:
            fields_data = block_data.pop("fields")
            block = Block.objects.create(form=form, **block_data)

            for field_data in fields_data:
                Field.objects.create(block=block, **field_data)

        return form

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
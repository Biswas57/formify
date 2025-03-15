from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import FormComposition, InfoBlock, IdShort, AddressInfo, Notes, Address

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
        user.is_active = True
        user.save()
        return user


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address_id', 'text', 'date_moved_in', 'date_moved_out']


class IdShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdShort
        fields = ['name', 'number', 'email', 'type']
        extra_kwargs = {
            'type': {'source': 'type'}
        }


class AddressInfoSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = AddressInfo
        fields = ['type', 'addresses']


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ['content']


class InfoBlockSerializer(serializers.ModelSerializer):
    id_short_data = serializers.SerializerMethodField(read_only=True)
    address_info_data = serializers.SerializerMethodField(read_only=True)
    notes_data = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = InfoBlock
        fields = ['info_id', 'info_type', 'order_id', 'id_short_data', 'address_info_data', 'notes_data']
    
    def get_id_short_data(self, obj):
        if hasattr(obj, 'id_short'):
            return IdShortSerializer(obj.id_short).data
        return None
    
    def get_address_info_data(self, obj):
        if hasattr(obj, 'address_info'):
            serializer = AddressInfoSerializer(obj.address_info)
            data = serializer.data
            # Add addresses data
            addresses = []
            for addr in obj.address_info.addresses.all():
                addresses.append(AddressSerializer(addr).data)
            data['addresses'] = addresses
            return data
        return None
    
    def get_notes_data(self, obj):
        if hasattr(obj, 'notes'):
            return NotesSerializer(obj.notes).data
        return None


class FormCompositionSerializer(serializers.ModelSerializer):
    blocks = InfoBlockSerializer(source='info_blocks', many=True, read_only=True)
    
    class Meta:
        model = FormComposition
        fields = ['form_id', 'name', 'has_id_short', 'has_address_info', 'has_notes', 'blocks']
        read_only_fields = ['form_id', 'has_id_short', 'has_address_info', 'has_notes']


class FormCreateSerializer(serializers.Serializer):
    form_name = serializers.CharField(required=True)
    blocks = serializers.ListField(
        child=serializers.DictField(),
        required=True,
        min_length=1
    )
    
    def validate_blocks(self, blocks):
        for block in blocks:
            block_type = block.get('type')
            if block_type not in ['id_short', 'address_info', 'notes']:
                raise serializers.ValidationError(f"Invalid block type: {block_type}")
                
            # Validate id_short fields
            if block_type == 'id_short':
                # Additional validation if needed
                pass
                
            # Validate address_info fields    
            elif block_type == 'address_info':
                addresses = block.get('addresses', [])
                if not isinstance(addresses, list):
                    raise serializers.ValidationError("Addresses must be a list")
                    
            # Validate notes fields
            elif block_type == 'notes':
                content = block.get('content', '')
                if len(content) > 1000:
                    raise serializers.ValidationError("Notes content cannot exceed 1000 characters")
                    
        return blocks
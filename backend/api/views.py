from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.db import transaction
from django.shortcuts import get_object_or_404

from .serializers import (
    UserRegistrationSerializer,
    FormCompositionSerializer,
    FormCreateSerializer
)
from .models import FormComposition, InfoBlock, IdShort, AddressInfo, Notes, Address


class RegisterUserView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to register

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "User created successfully.", "token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to log in

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Find the user with the provided email
        try:
            user = User.objects.get(email=email)
            username = user.username  # Get the username for authentication
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use Django's authenticate function with username and password
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if not user.is_active:
                return Response({"error": "Account is inactive. Please wait for activation."}, 
                               status=status.HTTP_403_FORBIDDEN)
            
            # Generate or retrieve authentication token
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can logout
    
    def post(self, request):
        # Delete the user's token to logout
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class FormCompositionView(APIView):
    """
    View for creating and retrieving form compositions (templates)
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, composition_id=None):
        """
        Get a specific form composition or all form compositions for the authenticated user
        """
        if composition_id:
            # Get a specific form composition
            composition = get_object_or_404(
                FormComposition, 
                form_composition_id=composition_id, 
                owner=request.user
            )
            return Response({
                'form_composition_id': composition.form_composition_id,
                'name': composition.name,
                'has_id_short': composition.has_id_short,
                'has_address_info': composition.has_address_info,
                'has_notes': composition.has_notes
            }, status=status.HTTP_200_OK)
        else:
            # Get all form compositions for the user
            compositions = FormComposition.objects.filter(owner=request.user)
            result = []
            for composition in compositions:
                result.append({
                    'form_composition_id': composition.form_composition_id,
                    'name': composition.name,
                    'has_id_short': composition.has_id_short,
                    'has_address_info': composition.has_address_info,
                    'has_notes': composition.has_notes
                })
            return Response(result, status=status.HTTP_200_OK)
    
    def post(self, request):
        """
        Create a new form composition template
        """
        # Extract request data
        name = request.data.get('name')
        has_id_short = request.data.get('has_id_short', False)
        has_address_info = request.data.get('has_address_info', False)
        has_notes = request.data.get('has_notes', False)
        
        # Validate required fields
        if not name:
            return Response(
                {"error": "Form composition name is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Create the form composition
        composition = FormComposition.objects.create(
            owner=request.user,
            name=name,
            has_id_short=has_id_short,
            has_address_info=has_address_info,
            has_notes=has_notes
        )
        
        return Response({
            'form_composition_id': composition.form_composition_id,
            'name': composition.name,
            'has_id_short': composition.has_id_short,
            'has_address_info': composition.has_address_info,
            'has_notes': composition.has_notes
        }, status=status.HTTP_201_CREATED)
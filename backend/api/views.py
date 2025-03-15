from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import UserRegistrationSerializer
from django.contrib.auth.hashers import check_password

class RegisterUserView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to register

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "User created successfully. Await activation.", "token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated users to log in

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Retrieve the user using email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Manually check the password instead of using authenticate()
        if check_password(password, user.password):  # Compare hashed password
            if not user.is_active:
                return Response({"error": "Account is inactive. Please wait for activation."}, status=status.HTTP_403_FORBIDDEN)

            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

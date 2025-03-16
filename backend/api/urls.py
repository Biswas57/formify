from django.urls import path
from .views import RegisterUserView, LoginView, LogoutView, FormCompositionView, FormCreateView

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # This is for Form Compositions

    path("form-compositions/", FormCompositionView.as_view(), name="composition_list"),
    path("form-compositions/<int:composition_id>/", FormCompositionView.as_view(), name="composition_detail"),

    # This is for FORM Creations 

    path("forms/create/", FormCreateView.as_view(), name="form_create"),

]

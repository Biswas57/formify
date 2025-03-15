from django.urls import path
from .views import RegisterUserView, LoginView, FormCreateView, FormListView, FormDetailView
from .views import upload_audio

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("forms/create/", FormCreateView.as_view(), name="create_form"),
    path("forms/list/", FormListView.as_view(), name="form_list"),
    path("forms/<int:form_id>/", FormDetailView.as_view(), name="form_detail"),
    path("forms/<int:form_id>/upload_audio/", upload_audio, name="upload_audio"),    
]

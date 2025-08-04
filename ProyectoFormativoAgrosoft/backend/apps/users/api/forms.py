from django import forms
from django.contrib.auth.forms import UserCreationForm
from apps.users.models import Usuario


class UsuarioCreationForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = [
            "identificacion",
            "nombre",
            "apellidos",
            "telefono",
            "correoElectronico",
        ]

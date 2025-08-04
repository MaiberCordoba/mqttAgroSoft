from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from apps.users.api.forms import UsuarioCreationForm


class UsuarioAdmin(UserAdmin):
    add_form = UsuarioCreationForm
    model = Usuario
    list_display = [
        "correoElectronico",
        "identificacion",
        "nombre",
        "apellidos",
        "telefono",
        "rol",
        
    ]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "correoElectronico",
                    "identificacion",
                    "nombre",
                    "apellidos",
                    "telefono",
                    "rol",
                    "password",
                )
            },
        ),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "correoElectronico",
                    "identificacion",
                    "nombre",
                    "apellidos",
                    "telefono",
                    "rol",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    ordering = ("correoElectronico",)


admin.site.register(Usuario, UsuarioAdmin)

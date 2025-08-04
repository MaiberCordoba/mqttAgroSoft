from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UsuarioManager(BaseUserManager):
    def create_user(
        self, correoElectronico, identificacion, password=None, **extra_fields
    ):
        if not correoElectronico:
            raise ValueError("El usuario debe tener un correo electrónico")
        if not identificacion:
            raise ValueError("El usuario debe tener una identificación")

        correoElectronico = self.normalize_email(correoElectronico)
        user = self.model(
            correoElectronico=correoElectronico,
            identificacion=identificacion,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, correoElectronico, identificacion, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("rol", "admin") 

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(
            correoElectronico, identificacion, password, **extra_fields
        )


class Usuario(AbstractUser):
    ESTADO_CHOICES = [
        ('activo',"activo"),
        ('inactivo',"inactivo")
    ]
    ROLES_CHOICES = [
        ('admin','admin'),
        ('instructor','instructor'),
        ('pasante','pasante'),
        ('aprendiz','aprendiz'),
        ('visitante','visitante')
    ]
    username = None
    identificacion = models.BigIntegerField(unique=True, null=False)
    nombre = models.CharField(max_length=30)
    apellidos = models.CharField(max_length=30)
    telefono = models.CharField(max_length=15)
    correoElectronico = models.CharField(max_length=255, unique=True, null=True, blank=True)
    estado=models.CharField(max_length=10,choices=ESTADO_CHOICES,default='activo')
    rol = models.CharField(max_length=12 ,choices=ROLES_CHOICES)

    USERNAME_FIELD = "correoElectronico"
    REQUIRED_FIELDS = [
        "identificacion",
        "nombre",
        "apellidos",
        "telefono",
    ]

    objects = UsuarioManager()

    def __str__(self):
        return str(self.identificacion)

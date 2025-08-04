from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = [
            "id",
            "identificacion",
            "nombre",
            "apellidos",
            "telefono",
            "correoElectronico",
            "password",
            "estado",
            "rol",
        ]
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "telefono": {"required": False},
            "correoElectronico": {"required": False},
        }

    def create(self, validated_data):
        # Generar correo temporal si no se proporciona
        if not validated_data.get('correoElectronico'):
            identificacion = validated_data.get('identificacion')
            validated_data['correoElectronico'] = f'{identificacion}@example.com'
        
        # Establecer valores por defecto
        validated_data.setdefault('rol', 'visitante')
        validated_data.setdefault('telefono', '')
        validated_data.setdefault('estado', 'activo')
        
        # Extraer la contraseña si existe, o usar identificación
        password = validated_data.pop('password', None)
        if password is None:
            # Si no hay contraseña, usar la identificación
            password = str(validated_data['identificacion'])
        
        # Crear usuario sin contraseña primero
        user = Usuario.objects.create(**validated_data)
        
        # Establecer contraseña correctamente
        user.set_password(password)
        user.save()
        
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Actualizar campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Manejo CRUCIAL de la contraseña
        if password:
            instance.set_password(password)  # Genera el hash correcto
        
        instance.save()
        return instance
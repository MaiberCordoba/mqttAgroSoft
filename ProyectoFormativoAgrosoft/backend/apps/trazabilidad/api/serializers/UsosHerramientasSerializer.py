from rest_framework.serializers import ModelSerializer, ValidationError
from ..models.UsosHerramientasModel import UsosHerramientas
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario


class UsosHerramientasSerializer(ModelSerializer):
    class Meta:
        model = UsosHerramientas
        fields = '__all__'

    def validate(self, data):
        # Validar que el usuario esté autenticado
        if not self.context['request'].user.is_authenticated:
            raise ValidationError("Debe estar autenticado para registrar un uso de herramienta.")
        return data

    def create(self, validated_data):
        cantidad = validated_data.get("unidades")
        herramienta = validated_data.get("fk_Herramienta")
        usuario = self.context['request'].user  # Obtener el usuario autenticado

        if herramienta is None:
            raise ValidationError("No se proporcionó una herramienta válida.")

        if herramienta.unidades is None or herramienta.unidades < cantidad:
            raise ValidationError("No hay suficientes unidades disponibles de la herramienta.")

        # Descontar las unidades disponibles
        herramienta.unidades -= cantidad
        herramienta.save()

        # Crear el uso
        usoH = super().create(validated_data)

        # Registrar movimiento de salida
        MovimientoInventario.objects.create(
            tipo="salida",
            fk_Herramienta=herramienta,
            fk_UsoHerramienta=usoH,
            unidades=cantidad,
            usuario=usuario  # Asignar el usuario autenticado
        )
        return usoH

    def update(self, instance, validated_data):
        nueva_cantidad = validated_data.get("unidades", instance.unidades)
        nueva_herramienta = validated_data.get("fk_Herramienta", instance.fk_Herramienta)
        usuario = self.context['request'].user  # Obtener el usuario autenticado

        if nueva_herramienta is None:
            raise ValidationError("No se proporcionó una herramienta válida.")

        # Si la herramienta cambió, devolver unidades a la anterior y descontar de la nueva
        if instance.fk_Herramienta != nueva_herramienta:
            # Devolver unidades a la herramienta anterior
            if instance.fk_Herramienta:
                instance.fk_Herramienta.unidades += instance.unidades
                instance.fk_Herramienta.save()

            # Verificar stock en la nueva herramienta
            if nueva_herramienta.unidades < nueva_cantidad:
                raise ValidationError("No hay suficientes unidades disponibles en la nueva herramienta.")

            nueva_herramienta.unidades -= nueva_cantidad
            nueva_herramienta.save()

            # Registrar movimiento de salida para la nueva herramienta
            MovimientoInventario.objects.create(
                tipo="salida",
                fk_Herramienta=nueva_herramienta,
                fk_UsoHerramienta=instance,
                unidades=nueva_cantidad,
                usuario=usuario
            )

        else:
            # Si es la misma herramienta, ajustar según la diferencia de cantidades
            diferencia = nueva_cantidad - instance.unidades
            if diferencia > 0:
                # Necesita más unidades
                if nueva_herramienta.unidades < diferencia:
                    raise ValidationError("No hay suficientes unidades disponibles para aumentar la cantidad.")
                nueva_herramienta.unidades -= diferencia
                # Registrar movimiento de salida
                MovimientoInventario.objects.create(
                    tipo="salida",
                    fk_Herramienta=nueva_herramienta,
                    fk_UsoHerramienta=instance,
                    unidades=diferencia,
                    usuario=usuario
                )
            elif diferencia < 0:
                # Devolver unidades
                nueva_herramienta.unidades += abs(diferencia)
                # Registrar movimiento de entrada
                MovimientoInventario.objects.create(
                    tipo="entrada",
                    fk_Herramienta=nueva_herramienta,
                    fk_UsoHerramienta=instance,
                    unidades=abs(diferencia),
                    usuario=usuario
                )
            nueva_herramienta.save()

        # Actualizar el uso
        instance.fk_Herramienta = nueva_herramienta
        instance.fk_Actividad = validated_data.get("fk_Actividad", instance.fk_Actividad)
        instance.fk_Control = validated_data.get("fk_Control", instance.fk_Control)
        instance.unidades = nueva_cantidad
        instance.save()

        return instance
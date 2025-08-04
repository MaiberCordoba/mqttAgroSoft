from rest_framework.serializers import ModelSerializer, ValidationError
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

class SerializerInsumos(ModelSerializer):
    class Meta:
        model = Insumos
        fields = '__all__'
        read_only_fields = ["valorTotalInsumos", "cantidadGramos", "totalGramos"]

    def validate(self, data):
        # Validar que el usuario esté autenticado
        if not self.context['request'].user.is_authenticated:
            raise ValidationError("Debe estar autenticado para crear o actualizar un insumo.")
        return data

    def create(self, validated_data):
        nombre = validated_data.get("nombre")
        unidad_medida = validated_data.get("fk_UnidadMedida")
        precio = validated_data.get("precio", 0)
        unidades = validated_data.get("unidades", 0)
        contenido = validated_data.get("contenido", 0)
        usuario = self.context['request'].user  # Obtener el usuario autenticado

        equivalencia_base = unidad_medida.equivalenciabase if unidad_medida else 1
        cantidad_gramos = unidades * contenido * equivalencia_base
        valor_total = precio * unidades

        # Buscar insumo existente solo por nombre
        insumo_existente = Insumos.objects.filter(nombre=nombre).first()

        if insumo_existente:
            # Sumar nuevos valores al existente
            insumo_existente.unidades += unidades
            insumo_existente.cantidadGramos += cantidad_gramos
            insumo_existente.totalGramos += cantidad_gramos
            insumo_existente.valorTotalInsumos += valor_total
            insumo_existente.save()

            # Registrar movimiento de entrada
            MovimientoInventario.objects.create(
                tipo='entrada',
                fk_Insumo=insumo_existente,
                unidades=unidades,
                usuario=usuario
            )

            return insumo_existente

        # Si no existe insumo con el mismo nombre, crear uno nuevo
        validated_data["cantidadGramos"] = cantidad_gramos
        validated_data["valorTotalInsumos"] = valor_total
        validated_data["totalGramos"] = cantidad_gramos

        insumo_nuevo = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo='entrada',
            fk_Insumo=insumo_nuevo,
            unidades=unidades,
            usuario=usuario
        )

        return insumo_nuevo

    def update(self, instance, validated_data):
        usuario = self.context['request'].user  # Obtener el usuario autenticado
        unidades_anteriores = instance.unidades
        precio_anterior = instance.precio
        contenido_anterior = instance.contenido
        equivalencia_base = validated_data.get("fk_UnidadMedida", instance.fk_UnidadMedida).equivalenciabase

        # Obtener nuevos valores (o mantener los existentes)
        unidades_nuevas = validated_data.get("unidades", unidades_anteriores)
        precio_nuevo = validated_data.get("precio", precio_anterior)
        contenido_nuevo = validated_data.get("contenido", contenido_anterior)

        # Calcular nuevos valores
        cantidad_gramos = unidades_nuevas * contenido_nuevo * equivalencia_base
        valor_total = precio_nuevo * unidades_nuevas

        # Actualizar campos derivados
        instance.cantidadGramos = cantidad_gramos
        instance.totalGramos = cantidad_gramos
        instance.valorTotalInsumos = valor_total

        # Actualizar otros campos directamente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Si las unidades cambiaron, registrar movimiento de inventario
        if unidades_nuevas != unidades_anteriores:
            diferencia = unidades_nuevas - unidades_anteriores
            tipo_movimiento = 'entrada' if diferencia > 0 else 'salida'

            MovimientoInventario.objects.create(
                tipo=tipo_movimiento,
                fk_Insumo=instance,
                unidades=abs(diferencia),
                usuario=usuario
            )

        return instance
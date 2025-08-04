from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from decimal import Decimal
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.serializers.serializerUnidadesMedida import serializerUnidadesMedida

class SerializerVentas(ModelSerializer):
    class Meta:
        model = Ventas
        fields = '__all__'
        read_only_fields = ['valorTotal',]

    def validate(self, data):
        cosecha = data.get('fk_Cosecha')
        unidad_medida = data.get('fk_UnidadMedida')
        cantidad = data.get('cantidad')

        if cosecha and unidad_medida and cantidad:
            cantidad_en_base = cantidad * unidad_medida.equivalenciabase

            if self.instance:
                cantidad_anterior_base = self.instance.cantidad * self.instance.fk_UnidadMedida.equivalenciabase
                cantidad_disponible_total = cosecha.cantidadTotal + cantidad_anterior_base

                if cantidad_en_base > cantidad_disponible_total:
                    raise ValidationError(
                        f"La cantidad solicitada ({cantidad_en_base}) excede la cantidad disponible ({cantidad_disponible_total})."
                    )
            else:
                if cantidad_en_base > cosecha.cantidadTotal:
                    raise ValidationError(
                        f"La cantidad solicitada ({cantidad_en_base}) excede la cantidad disponible ({cosecha.cantidadTotal})."
                    )

        return data

    def calcular_valor_total(self, precioGramo: float, cantidadTotal: float, descuento: float = 0) -> int:
        precioGramo = Decimal(precioGramo)
        cantidadTotal = Decimal(cantidadTotal)
        descuento = Decimal(descuento)

        subtotal = precioGramo * cantidadTotal
        descuento_aplicado = subtotal * (descuento / Decimal('100'))

        return int(subtotal - descuento_aplicado)

    def create(self, validated_data):
        cosecha = validated_data.get('fk_Cosecha')
        unidad_medida = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')
        descuento = validated_data.get('descuento') or 0

        precioGramo = cosecha.valorGramo
        cantidadTotal = cantidad * unidad_medida.equivalenciabase

        validated_data['valorTotal'] = self.calcular_valor_total(precioGramo, cantidadTotal, descuento)

        if cosecha and unidad_medida:
            cantidad_en_base = cantidad * unidad_medida.equivalenciabase
            cosecha.cantidadTotal -= cantidad_en_base
            cosecha.save()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        nueva_cantidad = validated_data.get('cantidad', instance.cantidad)
        nueva_unidad = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        nueva_descuento = validated_data.get('descuento', instance.descuento)
        cosecha = validated_data.get('fk_Cosecha', instance.fk_Cosecha)

        cantidad_anterior_base = instance.cantidad * instance.fk_UnidadMedida.equivalenciabase
        nueva_cantidad_base = nueva_cantidad * nueva_unidad.equivalenciabase

        diferencia = nueva_cantidad_base - cantidad_anterior_base

        # Validar que no se exceda la cantidad disponible
        if diferencia > 0 and diferencia > cosecha.cantidadTotal:
            raise ValidationError(
                f"La cantidad adicional solicitada ({diferencia}) excede la cantidad disponible ({cosecha.cantidadTotal})."
            )

        # Actualizar la cantidad de la cosecha
        cosecha.cantidadTotal -= diferencia
        cosecha.save()

        # Calcular nuevo valor total
        precioGramo = cosecha.valorGramo
        nuevo_valor_total = self.calcular_valor_total(precioGramo, nueva_cantidad_base, nueva_descuento)
        validated_data['valorTotal'] = nuevo_valor_total

        return super().update(instance, validated_data)

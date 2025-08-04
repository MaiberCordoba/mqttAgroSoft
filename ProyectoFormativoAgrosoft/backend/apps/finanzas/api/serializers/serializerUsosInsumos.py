from rest_framework.serializers import ModelSerializer, ValidationError
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario
from apps.finanzas.api.models.insumos import Insumos

class SerializerUsosInsumos(ModelSerializer):
    class Meta:
        model = UsosInsumos
        fields = '__all__'
        read_only_fields = ["costoUsoInsumo"]

    def validate(self, data):
        # Validar que el usuario esté autenticado
        if not self.context['request'].user.is_authenticated:
            raise ValidationError("Debe estar autenticado para registrar un uso de insumo.")
        
        fk_actividad = data.get('fk_Actividad')
        fk_control = data.get('fk_Control')

        if fk_actividad and fk_control:
            raise ValidationError("Solo se puede relacionar con una actividad o un control, no ambos.")
        if not fk_actividad and not fk_control:
            raise ValidationError("Debe relacionarse con una actividad o un control.")
        
        return data

    def create(self, validated_data):
        insumo = validated_data.get('fk_Insumo')
        unidad_medida = validated_data.get('fk_UnidadMedida')
        cantidad_producto = validated_data.get('cantidadProducto')
        usuario = self.context['request'].user
        cantidad_gramos = cantidad_producto * unidad_medida.equivalenciabase


        if insumo.cantidadGramos is None or insumo.cantidadGramos < cantidad_gramos:
            raise ValidationError({
                'cantidadProducto': f"No hay suficiente cantidad del insumo en stock. "
                                    f"Solicitado: {cantidad_gramos:.2f} g, "
                                    f"Disponible: {insumo.cantidadGramos or 0:.2f} g."
            })

        precio_uso_insumo = (insumo.valorTotalInsumos * cantidad_gramos) / insumo.totalGramos
        validated_data['costoUsoInsumo'] = precio_uso_insumo

        insumo.cantidadGramos -= cantidad_gramos
        insumo.save()

        uso = super().create(validated_data)

        MovimientoInventario.objects.create(
            tipo='salida',
            fk_Insumo=insumo,
            fk_UsoInsumo=uso,
            unidades=cantidad_producto,
            usuario=usuario
        )

        return uso

    def update(self, instance, validated_data):
        usuario = self.context['request'].user  # Obtener el usuario autenticado
        insumo = instance.fk_Insumo
        unidad_medida_anterior = instance.fk_UnidadMedida
        cantidad_producto_anterior = instance.cantidadProducto
        equivalencia_base_anterior = unidad_medida_anterior.equivalenciabase if unidad_medida_anterior else 1
        cantidad_gramos_anterior = cantidad_producto_anterior * equivalencia_base_anterior

        # Revertir uso anterior
        if insumo.cantidadGramos is None:
            insumo.cantidadGramos = 0
        insumo.cantidadGramos += cantidad_gramos_anterior

        # Calcular nuevo uso
        unidad_medida_nueva = validated_data.get('fk_UnidadMedida', unidad_medida_anterior)
        cantidad_producto_nuevo = validated_data.get('cantidadProducto', cantidad_producto_anterior)
        equivalencia_base_nueva = unidad_medida_nueva.equivalenciabase if unidad_medida_nueva else 1
        cantidad_gramos_nueva = cantidad_producto_nuevo * equivalencia_base_nueva

        if insumo.cantidadGramos < cantidad_gramos_nueva:
            raise ValidationError({
                'cantidadProducto': f"No hay suficiente cantidad del insumo para esta actualización. "
                                    f"Solicitado: {cantidad_gramos_nueva:.2f} g, "
                                    f"Disponible: {insumo.cantidadGramos:.2f} g."
            })

        # Calcular nuevo costo
        precio_uso_insumo = (insumo.valorTotalInsumos * cantidad_gramos_nueva) / insumo.totalGramos
        validated_data['costoUsoInsumo'] = precio_uso_insumo

        # Aplicar nuevo descuento
        insumo.cantidadGramos -= cantidad_gramos_nueva
        insumo.save()

        # Si la cantidad cambió, registrar movimiento de inventario
        if cantidad_producto_nuevo != cantidad_producto_anterior:
            diferencia = cantidad_producto_nuevo - cantidad_producto_anterior
            tipo_movimiento = 'salida' if diferencia > 0 else 'entrada'
            MovimientoInventario.objects.create(
                tipo=tipo_movimiento,
                fk_Insumo=insumo,
                fk_UsoInsumo=instance,
                unidades=abs(diferencia),
                usuario=usuario
            )

        return super().update(instance, validated_data)
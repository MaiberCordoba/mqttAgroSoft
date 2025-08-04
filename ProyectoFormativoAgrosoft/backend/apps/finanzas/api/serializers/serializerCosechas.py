from rest_framework import serializers
from apps.finanzas.api.models.cosechas import Cosechas

class SerializerCosechas(serializers.ModelSerializer):
    cantidadTotal = serializers.FloatField(read_only=True)
    cantidadDisponible = serializers.FloatField(read_only=True)

    class Meta:
        model = Cosechas
        fields = '__all__'
        read_only_fields = ('valorTotal','valorGramo',)

    def create(self, validated_data):
        unidad = validated_data.get('fk_UnidadMedida')
        cantidad = validated_data.get('cantidad')
        precioUnidad = validated_data.get('precioUnidad')

        valorGramo = precioUnidad / unidad.equivalenciabase
        validated_data['valorGramo'] = valorGramo

        valorTotal = precioUnidad*cantidad
        validated_data['valorTotal'] = valorTotal

        if unidad:
            equivalencia = unidad.equivalenciabase
            cantidad_total = cantidad * equivalencia
            validated_data['cantidadTotal'] = cantidad_total
        return super().create(validated_data)

    def update(self, instance, validated_data):
        unidad = validated_data.get('fk_UnidadMedida', instance.fk_UnidadMedida)
        cantidad = validated_data.get('cantidad', instance.cantidad)
        precioUnidad = validated_data.get('precioUnidad',instance.precioUnidad)

        valorGramo = precioUnidad / unidad.equivalenciabase
        validated_data['valorGramo'] = valorGramo

        valorTotal = precioUnidad*cantidad
        validated_data['valorTotal'] = valorTotal

        if unidad:
            equivalencia = unidad.equivalenciabase
            cantidad_total = cantidad * equivalencia
            validated_data['cantidadTotal'] = cantidad_total

        return super().update(instance, validated_data)

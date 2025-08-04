""" from rest_framework import serializers
from apps.finanzas.api.models.cosechaVenta import CosechaVenta
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class SerializerCosechaVenta(serializers.ModelSerializer):
    fk_Cosecha = serializers.PrimaryKeyRelatedField(queryset=Cosechas.objects.all())
    fk_UnidadMedida = serializers.PrimaryKeyRelatedField(queryset=UnidadesMedida.objects.all())

    class Meta:
        model = CosechaVenta
        fields = ['fk_Cosecha', 'fk_UnidadMedida', 'precioUnitario', 'cantidad']
 """
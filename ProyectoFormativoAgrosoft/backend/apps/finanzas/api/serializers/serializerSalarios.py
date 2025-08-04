from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.salarios import Salarios

class SerializerSalarios(ModelSerializer):

    monto_minutos = serializers.FloatField(read_only=True)  # ✅ Aquí el cambio

    class Meta:
        model = Salarios
        fields = '__all__'

    def create(self, validated_data):
        horas = validated_data.get('horas')
        monto = validated_data.get('monto')
        validated_data['monto_minutos'] = monto / (horas * 60)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        horas = validated_data.get('horas', instance.horas)
        monto = validated_data.get('monto', instance.monto)
        validated_data['monto_minutos'] = monto / (horas * 60)
        return super().update(instance, validated_data)

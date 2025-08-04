from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.era import Eras

class SensorSerializer(ModelSerializer):
    fk_lote_id = serializers.PrimaryKeyRelatedField(
        queryset=Lote.objects.all(), 
        source='fk_lote', 
        write_only=True, 
        required=False,
        allow_null=True
    )
    fk_eras_id = serializers.PrimaryKeyRelatedField(
        queryset=Eras.objects.all(), 
        source='fk_eras', 
        write_only=True, 
        required=False,
        allow_null=True
    )

    class Meta:
        model = Sensor
        fields = '__all__'
        extra_kwargs = {
            'fk_lote': {'read_only': True},
            'fk_eras': {'read_only': True}
        }

    def validate(self, data):
        tipo = data.get('tipo')
        errores = {}

        # Validación corregida para sensores que requieren lote
        if tipo in ['TEM', 'LUM', 'HUM_A', 'VIE', 'LLUVIA']:
            if 'fk_lote_id' not in data and 'fk_lote' not in data:
                errores['fk_lote_id'] = "Este campo es requerido para sensores de ambiente"

        # Validación corregida para sensores que requieren era
        if tipo in ['HUM_T', 'PH']:
            if 'fk_eras_id' not in data and 'fk_eras' not in data:
                errores['fk_eras_id'] = "Este campo es requerido para sensores de terreno"

        # Validación de umbrales
        umbral_max = data.get('umbral_maximo')
        umbral_min = data.get('umbral_minimo')
        
        if umbral_max is not None and umbral_min is not None:
            if umbral_max <= umbral_min:
                errores['umbrales'] = "El umbral máximo debe ser mayor que el mínimo"

        if errores:
            raise serializers.ValidationError(errores)

        return data
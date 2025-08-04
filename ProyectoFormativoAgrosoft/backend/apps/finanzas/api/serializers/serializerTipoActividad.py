from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.tipoActividad import TipoActividad

class SerializerTipoActividad(ModelSerializer):
    class Meta:
        model = TipoActividad
        fields = '__all__'
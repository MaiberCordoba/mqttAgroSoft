from rest_framework.serializers import ModelSerializer
from ..models.SemillerosModel import Semilleros
from apps.finanzas.api.serializers.serializerCultivos import SerializerCultivos

class SemillerosSerializer(ModelSerializer):
    cultivo = SerializerCultivos(source='fk_Cultivo',read_only=True)
    class Meta:
        model = Semilleros
        fields = '__all__'
from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.cultivos import Cultivos
from apps.trazabilidad.api.serializers.EspeciesSerializer import EspeciesSerializer

class SerializerCultivos(ModelSerializer):
    especies = EspeciesSerializer(source='fk_Especie',read_only=True)
    class Meta:
        model = Cultivos
        fields = '__all__'

from rest_framework.serializers import ModelSerializer
from ..models.TiposEspecieModel import TiposEspecie

class TiposEspecieSerializer(ModelSerializer):
    class Meta:
        model = TiposEspecie
        fields = '__all__'
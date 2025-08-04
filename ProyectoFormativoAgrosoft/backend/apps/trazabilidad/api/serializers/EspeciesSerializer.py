from rest_framework.serializers import ModelSerializer
from ..models.EspeciesModel import Especies
from .TiposEspecieSerializer import TiposEspecieSerializer

class EspeciesSerializer(ModelSerializer):
    tiposEspecie = TiposEspecieSerializer(source='fk_tipoespecie',read_only=True)
    class Meta:
        model = Especies
        fields = '__all__'
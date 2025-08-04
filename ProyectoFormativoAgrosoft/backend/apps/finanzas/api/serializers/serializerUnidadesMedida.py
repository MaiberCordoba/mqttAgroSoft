from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida


class serializerUnidadesMedida(ModelSerializer):
    class Meta:
        model = UnidadesMedida
        fields = '__all__'

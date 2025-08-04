from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.unidadesTiempo import UnidadesTiempo

class serializerUnidadesTiempo(ModelSerializer):
    class Meta:
        model = UnidadesTiempo
        fields = '__all__'

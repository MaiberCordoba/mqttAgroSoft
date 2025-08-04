from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.desechos import Desechos

class SerializerDesechos(ModelSerializer):
    class Meta:
        model = Desechos
        fields = '__all__'

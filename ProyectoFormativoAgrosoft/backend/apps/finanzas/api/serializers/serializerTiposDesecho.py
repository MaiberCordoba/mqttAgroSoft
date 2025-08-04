from rest_framework.serializers import ModelSerializer
from apps.finanzas.api.models.tiposDesecho import TiposDesecho

class SerializerTiposDesecho(ModelSerializer):
    class Meta:
        model = TiposDesecho
        fields = '__all__'

from rest_framework.serializers import ModelSerializer
from apps.sanidad.api.models.tipoPlaga import tipoPlaga

class TipoPlagaModelSerializer(ModelSerializer):
    class Meta:
        model = tipoPlaga
        fields = "__all__"

    
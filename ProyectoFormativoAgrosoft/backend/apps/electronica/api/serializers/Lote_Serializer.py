from rest_framework.serializers import ModelSerializer
from apps.electronica.api.models.lote import Lote

class LoteSerializer(ModelSerializer):
    class Meta:
        model = Lote
        fields = "__all__"

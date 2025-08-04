from rest_framework.serializers import ModelSerializer
from apps.electronica.api.serializers.Lote_Serializer import *
from apps.electronica.api.models.era import *
from apps.finanzas.api.models.cultivos import *
from apps.trazabilidad.api.models.SemillerosModel import *
from apps.trazabilidad.api.models.EspeciesModel import *
from apps.trazabilidad.api.models.PlantacionesModel import *


class ErasSerializer(ModelSerializer):
    Lote = LoteSerializer(source='fk_lote',read_only=True)
    class Meta:
        model = Eras
        fields = '__all__'  
from rest_framework.serializers import  ModelSerializer;
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones;
from apps.sanidad.api.serializers.plagaSerializer import PlagaModelSerializer;
from apps.trazabilidad.api.serializers.PlantacionesSerializer import PlantacionesSerializer

class AfeccionesModelSerializer(ModelSerializer):
    plagas = PlagaModelSerializer(source='fk_Plaga',read_only=True)
    plantaciones = PlantacionesSerializer (source='fk_Plantacion',read_only=True)

    class Meta:
        model = Afecciones
        fields = "__all__"
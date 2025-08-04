from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.serializers.serializerCultivos import SerializerCultivos

class ViewCultivos(ModelViewSet):
    queryset = Cultivos.objects.all()
    serializer_class = SerializerCultivos

from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.serializers.serializerTipoActividad import SerializerTipoActividad
from apps.finanzas.api.models.tipoActividad import TipoActividad

class ViewTipoActividad(ModelViewSet):
    queryset = TipoActividad.objects.all()
    serializer_class = SerializerTipoActividad 
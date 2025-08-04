from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.serializers.serializerTiposDesecho import SerializerTiposDesecho
from apps.finanzas.api.models.tiposDesecho import TiposDesecho

class ViewTiposDesecho(ModelViewSet):
    queryset = TiposDesecho.objects.all()
    serializer_class = SerializerTiposDesecho 
from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.serializers.serializerUnidadesTiempo import serializerUnidadesTiempo
from apps.finanzas.api.models.unidadesTiempo import UnidadesTiempo

class viewUnidadesTiempo(ModelViewSet):
    queryset = UnidadesTiempo.objects.all()
    serializer_class = serializerUnidadesTiempo 
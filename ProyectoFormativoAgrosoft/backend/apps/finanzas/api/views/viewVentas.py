from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.serializers.serializerVentas import SerializerVentas

class ViewVentas(ModelViewSet):
    queryset = Ventas.objects.all()
    serializer_class = SerializerVentas

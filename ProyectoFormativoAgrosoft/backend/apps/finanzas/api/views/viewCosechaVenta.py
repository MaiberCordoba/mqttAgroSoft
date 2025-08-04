""" from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.cosechaVenta import CosechaVenta
from apps.finanzas.api.serializers.serializerCosechasVentas import SerializerCosechaVenta

class ViewCosechaVenta(ModelViewSet):
    queryset = CosechaVenta.objects.all()
    serializer_class = SerializerCosechaVenta

 """
from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario
from apps.finanzas.api.serializers.serializerMovimientosInventario import SerializerMovimientoInventario

class ViewMovimientoInventario(ModelViewSet) :
    queryset = MovimientoInventario.objects.all()
    serializer_class = SerializerMovimientoInventario

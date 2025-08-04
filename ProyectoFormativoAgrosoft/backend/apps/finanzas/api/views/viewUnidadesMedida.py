from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.serializers.serializerUnidadesMedida import serializerUnidadesMedida
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida


class viewUnidadesMedida(ModelViewSet):
    queryset = UnidadesMedida.objects.all()
    serializer_class = serializerUnidadesMedida
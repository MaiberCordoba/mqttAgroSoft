from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.serializers.serializerCosechas import SerializerCosechas

class ViewCosechas(ModelViewSet):
    queryset = Cosechas.objects.all()
    serializer_class = SerializerCosechas 
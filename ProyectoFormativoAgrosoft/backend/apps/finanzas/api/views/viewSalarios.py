from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.salarios import Salarios
from apps.finanzas.api.serializers.serializerSalarios import SerializerSalarios

class SalariosViewSet(ModelViewSet):
    queryset = Salarios.objects.all()
    serializer_class = SerializerSalarios
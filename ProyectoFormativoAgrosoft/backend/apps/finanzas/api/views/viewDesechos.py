from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.desechos import Desechos
from apps.finanzas.api.serializers.serializerDesechos import SerializerDesechos

class ViewDesechos(ModelViewSet):
    queryset = Desechos.objects.all()
    serializer_class = SerializerDesechos 
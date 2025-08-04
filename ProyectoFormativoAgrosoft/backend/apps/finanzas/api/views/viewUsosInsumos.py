from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.serializers.serializerUsosInsumos import SerializerUsosInsumos

class ViewUsosInsumos(ModelViewSet):
    queryset = UsosInsumos.objects.all()
    serializer_class = SerializerUsosInsumos
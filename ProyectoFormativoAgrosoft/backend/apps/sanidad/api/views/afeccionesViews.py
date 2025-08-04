from rest_framework.viewsets import ModelViewSet;
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones;
from apps.sanidad.api.serializers.afeccionesSerializer import AfeccionesModelSerializer;
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AfeccionesModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = AfeccionesModelSerializer
    queryset = Afecciones.objects.all()
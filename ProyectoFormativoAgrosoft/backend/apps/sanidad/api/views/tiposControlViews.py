from rest_framework.viewsets import ModelViewSet;
from apps.sanidad.api.models.TiposControlModel import TiposControl;
from apps.sanidad.api.serializers.tiposControlSerializer import TiposControlModelSerializer;
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class TiposControlModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TiposControlModelSerializer
    queryset = TiposControl.objects.all()
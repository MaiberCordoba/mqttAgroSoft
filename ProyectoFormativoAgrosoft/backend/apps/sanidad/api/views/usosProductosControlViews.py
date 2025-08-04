from rest_framework.viewsets import ModelViewSet;
from apps.sanidad.api.models.UsoProductosControlModel import UsoProductosControl;
from apps.sanidad.api.serializers.usosProductosControlSerializer import UsoProductosControlModelSerializer;
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class UsoProductosControlModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UsoProductosControlModelSerializer
    queryset = UsoProductosControl.objects.all()
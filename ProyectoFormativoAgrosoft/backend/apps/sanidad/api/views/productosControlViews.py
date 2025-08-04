from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.models.ProductosControlModel import ProductosControl
from apps.sanidad.api.serializers.productosControlSerializer import ProductosControlModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProductosControlModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ProductosControlModelSerializer
    queryset = ProductosControl.objects.all()
from rest_framework.viewsets import ModelViewSet
from ..models.EspeciesModel import Especies
from ..serializers.EspeciesSerializer import EspeciesSerializer

class EspeciesViewSet(ModelViewSet):
    queryset = Especies.objects.all()
    serializer_class = EspeciesSerializer
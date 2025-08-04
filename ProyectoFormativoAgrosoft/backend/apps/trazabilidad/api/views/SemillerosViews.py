from rest_framework.viewsets import ModelViewSet
from ..models.SemillerosModel import Semilleros
from ..serializers.SemillerosSerializer import SemillerosSerializer

class SemillerosViewSet(ModelViewSet):
    queryset = Semilleros.objects.all()
    serializer_class = SemillerosSerializer
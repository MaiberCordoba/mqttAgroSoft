from rest_framework.viewsets import ModelViewSet
from ..models.HerramientasModel import Herramientas
from ..serializers.HerramientasSerializer import HerramientasSerializer

class HerramientasViewSet(ModelViewSet):
    queryset = Herramientas.objects.all()
    serializer_class = HerramientasSerializer
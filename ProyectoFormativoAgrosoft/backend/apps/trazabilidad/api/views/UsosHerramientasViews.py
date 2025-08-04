from rest_framework.viewsets import ModelViewSet
from ..models.UsosHerramientasModel import UsosHerramientas
from ..serializers.UsosHerramientasSerializer import UsosHerramientasSerializer

class UsosHerramientasViewSet(ModelViewSet):
    queryset = UsosHerramientas.objects.all()
    serializer_class = UsosHerramientasSerializer
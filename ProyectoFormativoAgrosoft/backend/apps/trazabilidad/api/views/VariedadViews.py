from rest_framework.viewsets import ModelViewSet
from ..models.VariedadModel import Variedad
from ..serializers.VariedadSerializer import VariedadSerializer

class VariedadViewSet(ModelViewSet):
    queryset = Variedad.objects.all()
    serializer_class = VariedadSerializer
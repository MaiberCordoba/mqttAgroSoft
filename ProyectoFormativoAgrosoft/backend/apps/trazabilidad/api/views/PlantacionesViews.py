from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.PlantacionesModel import Plantaciones
from ..serializers.PlantacionesSerializer import PlantacionesSerializer

class PlantacionesViewSet(ModelViewSet):
    queryset = Plantaciones.objects.all()
    serializer_class = PlantacionesSerializer

    @action(detail=False, methods=['get'])
    def resumen(self, request):
        total = Plantaciones.objects.count()
        # Aquí puedes agregar más lógica si quieres retornar otros datos
        return Response({
            'total_plantaciones': total
        })

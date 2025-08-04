from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.models.tipoPlaga import tipoPlaga
from apps.sanidad.api.serializers.tipoPlagaSerializer import TipoPlagaModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class TipoPlagaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]    
    serializer_class = TipoPlagaModelSerializer
    queryset = tipoPlaga.objects.all()
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Si llega una nueva imagen, elimina la anterior
        if 'img' in request.FILES and instance.img:
            instance.img.delete(save=False)

        return super().update(request, *args, **kwargs)
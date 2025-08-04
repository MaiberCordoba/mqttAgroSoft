from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.models.PlagaModel import Plaga
from apps.sanidad.api.serializers.plagaSerializer import PlagaModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class PlagaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PlagaModelSerializer
    queryset = Plaga.objects.all()
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Si llega una nueva imagen, elimina la anterior
        if 'img' in request.FILES and instance.img:
            instance.img.delete(save=False)

        return super().update(request, *args, **kwargs)
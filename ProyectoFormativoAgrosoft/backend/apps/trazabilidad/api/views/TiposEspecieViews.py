from rest_framework.viewsets import ModelViewSet
from ..models.TiposEspecieModel import TiposEspecie
from ..serializers.TiposEspecieSerializer import TiposEspecieSerializer


class TiposEspecieViewSet(ModelViewSet):
    queryset = TiposEspecie.objects.all()
    serializer_class = TiposEspecieSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Si llega una nueva imagen, elimina la anterior
        if 'img' in request.FILES and instance.img:
            instance.img.delete(save=False)

        return super().update(request, *args, **kwargs)
from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.serializers.serializerInsumos import SerializerInsumos

class ViewInsumos(ModelViewSet):
    queryset = Insumos.objects.all()
    serializer_class = SerializerInsumos 

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if 'fichaTecnica' in request.FILES and instance.fichaTecnica:
            instance.fichaTecnica.delete(save=False)
        return super().update(request, *args, **kwargs)
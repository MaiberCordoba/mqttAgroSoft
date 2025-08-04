from rest_framework.serializers import ModelSerializer;
from apps.sanidad.api.models.UsoProductosControlModel import UsoProductosControl;
from apps.sanidad.api.serializers.productosControlSerializer import ProductosControlModelSerializer
from apps.sanidad.api.serializers.controlesSerializer import ControlesModelSerializer

class UsoProductosControlModelSerializer(ModelSerializer):
    productoControl = ProductosControlModelSerializer(source='fk_ProductoControl',read_only=True)
    control = ControlesModelSerializer(source='fk_Control',read_only=True)
    class Meta:
        model = UsoProductosControl
        fields = "__all__"

from rest_framework.serializers import  ModelSerializer;
from apps.sanidad.api.models.ProductosControlModel import ProductosControl;

class ProductosControlModelSerializer(ModelSerializer):
    class Meta:
        model = ProductosControl
        fields = "__all__"
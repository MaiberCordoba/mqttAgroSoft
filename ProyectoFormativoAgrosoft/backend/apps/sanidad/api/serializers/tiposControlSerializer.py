from rest_framework.serializers import ModelSerializer;
from apps.sanidad.api.models.TiposControlModel import TiposControl;

class TiposControlModelSerializer(ModelSerializer):
    class Meta:
        model = TiposControl
        fields = "__all__"
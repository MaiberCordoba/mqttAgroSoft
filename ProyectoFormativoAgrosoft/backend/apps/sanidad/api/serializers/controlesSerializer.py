from rest_framework.serializers import ModelSerializer
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.serializers.afeccionesSerializer import AfeccionesModelSerializer
from apps.sanidad.api.serializers.tiposControlSerializer import TiposControlModelSerializer
from apps.users.serializers import UsuarioSerializer


class ControlesModelSerializer(ModelSerializer):
    afeccion = AfeccionesModelSerializer(source='fk_Afeccion', read_only=True)
    tipoControl = TiposControlModelSerializer(source='fk_TipoControl', read_only=True)
    usuario = UsuarioSerializer(source='fk_Usuario', read_only=True)  # CORREGIDO

    class Meta:
        model = Controles
        fields = "__all__"

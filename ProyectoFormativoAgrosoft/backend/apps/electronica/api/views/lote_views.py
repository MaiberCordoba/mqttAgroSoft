from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.serializers.Lote_Serializer import LoteSerializer
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import math

class LoteView(ModelViewSet):
    queryset = Lote.objects.all()
    serializer_class = LoteSerializer
    #permission_classes = [IsAuthenticated]


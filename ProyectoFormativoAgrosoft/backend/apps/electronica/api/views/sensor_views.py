from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from apps.electronica.api.models.sensor import Sensor
from apps.electronica.api.serializers.Sensor_Serializer import SensorSerializer
from django.db.models import Avg,  Count, Max
from rest_framework.decorators import action
from rest_framework.response import Response

class SensoresView(ModelViewSet):
    queryset = Sensor.objects.all().order_by('-fecha')
    serializer_class = SensorSerializer
    filterset_fields = ['tipo', 'fk_lote', 'fk_eras']
    
    SENSOR_UNITS = {
        'TEM': '°C',
        'LUM': 'lux',
        'HUM_A': '%',
        'VIE': 'km/h',
        'HUM_T': '%',
        'PH': 'pH',
        'LLUVIA': 'mm'
    }

    @action(detail=False, methods=['get'], url_path='averages')
    def averages(self, request):
        try:
            # Obtener parámetros
            hours = int(request.query_params.get('hours', 24))
            lote_id = request.query_params.get('lote_id')
            era_id = request.query_params.get('era_id')
            
            # Crear queryset base con todos los sensores
            queryset = self.filter_queryset(self.get_queryset())
            
            # Aplicar filtro de tiempo
            time_threshold = timezone.now() - timedelta(hours=hours)
            queryset = queryset.filter(fecha__gte=time_threshold)
            
            # Aplicar filtros adicionales si existen
            if lote_id:
                queryset = queryset.filter(fk_lote_id=lote_id)
            if era_id:
                queryset = queryset.filter(fk_eras_id=era_id)
            
            # Obtener todos los tipos de sensores posibles
            all_sensor_types = dict(Sensor.SENSOR_TYPES).keys()
            
            # Calcular promedios para los sensores que tienen datos
            averages = queryset.values('tipo').annotate(
                average_value=Avg('valor'),
                min_threshold=Avg('umbral_minimo'),
                max_threshold=Avg('umbral_maximo'),
                count=Count('id'),
                latest=Max('fecha')
            ).order_by('tipo')
            
            # Formatear respuesta incluyendo todos los tipos
            result = {}
            for sensor_type in all_sensor_types:
                # Buscar si existe promedio para este tipo
                avg_data = next((a for a in averages if a['tipo'] == sensor_type), None)
                
                if avg_data:
                    # Si hay datos, agregarlos
                    result[sensor_type] = {
                        'average': float(avg_data['average_value']) if avg_data['average_value'] is not None else 0,
                        'unit': self.SENSOR_UNITS.get(sensor_type, ''),
                        'min_threshold': float(avg_data['min_threshold']) if avg_data['min_threshold'] is not None else None,
                        'max_threshold': float(avg_data['max_threshold']) if avg_data['max_threshold'] is not None else None,
                        'count': avg_data['count'],
                        'latest_reading': avg_data['latest']
                    }
                else:
                    # Si no hay datos, devolver estructura vacía
                    result[sensor_type] = {
                        'average': None,
                        'unit': self.SENSOR_UNITS.get(sensor_type, ''),
                        'min_threshold': None,
                        'max_threshold': None,
                        'count': 0,
                        'latest_reading': None
                    }
            
            return Response(result)
            
        except ValueError as e:
            return Response(
                {"error": f"Parámetro inválido: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error interno del servidor: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SensorHistoryView(APIView):
    def get(self, request, pk=None, format=None):
        hours = request.query_params.get('hours')
        sensor_type = request.query_params.get('type')
        lote_id = request.query_params.get('lote_id')
        era_id = request.query_params.get('era_id')
        limit = request.query_params.get('limit', 100) 
        
        queryset = Sensor.objects.all()
        
        if pk: 
            try:
                sensor = Sensor.objects.get(pk=pk)
                queryset = queryset.filter(id=pk)
            except Sensor.DoesNotExist:
                return Response({"error": "Sensor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        if sensor_type:
            queryset = queryset.filter(tipo=sensor_type)
            
        if lote_id:
            queryset = queryset.filter(fk_lote_id=lote_id)
            
        if era_id:
            queryset = queryset.filter(fk_eras_id=era_id)
            
        if hours:
            try:
                hours = int(hours)
                time_threshold = timezone.now() - timedelta(hours=hours)
                queryset = queryset.filter(fecha__gte=time_threshold)
            except ValueError:
                return Response({"error": "Parámetro 'hours' debe ser un número entero"}, status=status.HTTP_400_BAD_REQUEST)

        data = list(queryset.order_by('-fecha')[:limit].values(
            'id', 'valor', 'fecha', 'tipo', 'umbral_minimo', 'umbral_maximo',
            'fk_lote_id', 'fk_eras_id'
        ))
        return Response(data)
    
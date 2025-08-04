from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Avg
from apps.electronica.api.models.sensor import Sensor
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.cultivos import CoeficienteCultivo
import logging
import math

logger = logging.getLogger(__name__)

class EvapotranspiracionHistoricaView(APIView):
    SENSORES_REQUERIDOS = ['TEM', 'VIE', 'LUM', 'HUM_A', 'HUM_T']
    FACTOR_LUX = 0.0864          # Conversión lux -> MJ/m²/día
    FACTOR_VIENTO_KMH_A_MS = 0.277778  # km/h -> m/s
    ALBEDO = 0.23                # Albedo para cultivos
    PRESION_ATMOSFERICA = 101.3  # kPa (nivel del mar)
    GAMMA = 0.0673645            # Constante psicrométrica (kPa/°C)

    def get(self, request):
        plantacion_id = request.query_params.get('plantacion_id')
        dias = int(request.query_params.get('dias', 30))  # Corregido typo 'dias'

        if not plantacion_id:
            return Response(
                {'error': 'Parámetro plantacion_id requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            plantacion = Plantaciones.objects.select_related(
                'fk_Cultivo', 'fk_Era__fk_lote'
            ).get(pk=plantacion_id)
            
            if not plantacion.fk_Era or not plantacion.fk_Era.fk_lote:
                return Response(
                    {'error': 'La plantación no tiene ubicación válida'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            lote = plantacion.fk_Era.fk_lote
            era = plantacion.fk_Era

            hoy = timezone.now().date()
            resultados = []

            for i in range(dias):
                fecha_consulta = hoy - timedelta(days=i)
                dias_siembra = (fecha_consulta - plantacion.fechaSiembra).days
                
                # Obtener coeficiente de cultivo para este día
                kc = 0.7
                et_min = None
                et_max = None
                hum_min = None
                hum_max = None
                try:
                    kc_obj = CoeficienteCultivo.objects.filter(
                        cultivo=plantacion.fk_Cultivo,
                        dias_desde_siembra__lte=dias_siembra
                    ).order_by('-dias_desde_siembra').first()
                    
                    if kc_obj:
                        kc = kc_obj.kc_valor
                        et_min = kc_obj.et_minima
                        et_max = kc_obj.et_maxima
                        hum_min = kc_obj.humedad_optima_min
                        hum_max = kc_obj.humedad_optima_max
                except CoeficienteCultivo.DoesNotExist:
                    pass

                # Obtener datos de sensores para este día
                sensores = Sensor.objects.filter(
                    Q(fk_eras=era) | Q(fk_lote=lote),
                    fecha__date=fecha_consulta,
                    tipo__in=self.SENSORES_REQUERIDOS
                ).values('tipo').annotate(promedio=Avg('valor'))
                
                datos = {s['tipo']: float(s['promedio']) for s in sensores}
                
                # Verificar si tenemos datos mínimos para cálculo
                sensores_obligatorios = ['TEM', 'VIE', 'LUM', 'HUM_A']
                if all(sensor in datos for sensor in sensores_obligatorios):
                    # Calcular ET usando Penman-Monteith
                    et_real = self._calcular_et_diaria(datos, kc, hum_min, hum_max)
                    
                    # Determinar estado de humedad del suelo
                    estado_humedad = None
                    hum_suelo = datos.get('HUM_T')
                    
                    if hum_suelo is not None:
                        if hum_min and hum_suelo < hum_min:
                            estado_humedad = 'bajo'
                        elif hum_max and hum_suelo > hum_max:
                            estado_humedad = 'alto'
                        elif hum_min and hum_max:
                            estado_humedad = 'optimo'
                    
                    resultados.append({
                        'fecha': fecha_consulta.strftime('%Y-%m-%d'),
                        'et_mm_dia': round(et_real, 2),
                        'kc': round(kc, 2),
                        'et_minima': float(et_min) if et_min else None,
                        'et_maxima': float(et_max) if et_max else None,
                        'hum_optima_min': float(hum_min) if hum_min else None,
                        'hum_optima_max': float(hum_max) if hum_max else None,
                        'estado_humedad': estado_humedad,
                        'temperatura': round(datos['TEM'], 2),
                        'humedad_aire': round(datos['HUM_A'], 2),
                        'humedad_suelo': round(hum_suelo, 2) if hum_suelo else None,
                        'viento': round(datos['VIE'], 2),
                        'iluminacion': round(datos['LUM'], 2),
                        'dias_siembra': dias_siembra
                    })

            return Response(sorted(resultados, key=lambda x: x['fecha']))

        except Plantaciones.DoesNotExist:
            return Response(
                {'error': 'Plantación no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error histórico: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Error interno: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def _calcular_et_diaria(self, datos, kc, hum_min, hum_max):
        """Calcula la evapotranspiración diaria usando Penman-Monteith FAO 56"""
        try:
            # Preparar datos
            temp = datos['TEM']  # °C
            rad_solar = datos['LUM'] * self.FACTOR_LUX  # MJ/m²/día
            vel_viento_ms = datos['VIE'] * self.FACTOR_VIENTO_KMH_A_MS  # m/s
            hum_rel = datos['HUM_A']  # %
            
            # 1. Presión de vapor saturado (es) y actual (ea)
            es = 0.6108 * math.exp(17.27 * temp / (temp + 237.3))  # kPa
            ea = es * hum_rel / 100.0  # kPa
            
            # 2. Pendiente de la curva de presión de vapor (Δ)
            delta = 4098 * es / ((temp + 237.3) ** 2)  # kPa/°C
            
            # 3. Radiación neta (Rn) - Simplificada
            rn = (1 - self.ALBEDO) * rad_solar  # MJ/m²/día
            
            # 4. Cálculo ET0 (Penman-Monteith FAO 56)
            numerador = (0.408 * delta * rn) + (self.GAMMA * (900 / (temp + 273)) * vel_viento_ms * (es - ea))
            denominador = delta + self.GAMMA * (1 + 0.34 * vel_viento_ms)
            et0 = numerador / denominador  # mm/día
            
            # 5. Factor de estrés hídrico (Ks)
            ks = 1.0
            hum_suelo = datos.get('HUM_T')
            
            if hum_suelo is not None and hum_min is not None and hum_max is not None:
                if hum_suelo < hum_min:
                    ks = max(0.2, hum_suelo / hum_min)
                elif hum_suelo > hum_max:
                    reduccion = min(0.5, (hum_suelo - hum_max) / (100 - hum_max))
                    ks = 1.0 - reduccion
            
            # 6. ET real = ET0 * Kc * Ks
            et_real = max(et0 * kc * ks, 0)
            return et_real
            
        except (KeyError, ZeroDivisionError, ValueError) as e:
            logger.warning(f"Error cálculo ET diaria: {str(e)}")
            return 0.0
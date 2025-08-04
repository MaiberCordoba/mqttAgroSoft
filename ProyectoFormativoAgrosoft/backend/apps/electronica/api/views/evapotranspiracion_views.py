from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Q
from django.utils import timezone
from apps.electronica.api.models.sensor import Sensor
from apps.finanzas.api.models.cultivos import CoeficienteCultivo
from django.core.exceptions import ObjectDoesNotExist
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
import logging
import math

logger = logging.getLogger(__name__)

class CalcularEvapotranspiracionView(APIView):
    SENSORES_REQUERIDOS = ['TEM', 'VIE', 'LUM', 'HUM_A', 'HUM_T']
    FACTOR_LUX = 0.0864          # Conversión lux -> MJ/m²/día
    FACTOR_VIENTO_KMH_A_MS = 0.277778  # km/h -> m/s
    ALBEDO = 0.23                # Albedo para cultivos
    PRESION_ATMOSFERICA = 101.3  # kPa (nivel del mar)
    GAMMA = 0.0673645            # Constante psicrométrica (kPa/°C)

    def get(self, request):
        plantacion_id = request.query_params.get('plantacion_id')
        kc_param = request.query_params.get('kc')

        try:
            plantacion = self._obtener_plantacion(plantacion_id)
            self._validar_ubicacion(plantacion)
            kc, kc_obj = self._determinar_kc(plantacion, kc_param)
            datos_sensores = self._obtener_datos_sensores(plantacion)
            et_real = self._calcular_evapotranspiracion(datos_sensores, kc, kc_obj)
            
            return Response(
                self._construir_respuesta(et_real, kc, plantacion, datos_sensores, kc_obj),
                status=status.HTTP_200_OK
            )

        except ObjectDoesNotExist as e:
            logger.error(f"Objeto no encontrado: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            logger.warning(f"Error de validación: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.critical(f"Error interno: {str(e)}", exc_info=True)
            return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _obtener_plantacion(self, plantacion_id):
        try:
            return Plantaciones.objects.select_related(
                'fk_Cultivo', 'fk_Era__fk_lote'
            ).get(pk=plantacion_id)
        except Plantaciones.DoesNotExist:
            raise ObjectDoesNotExist("Plantación no encontrada")

    def _validar_ubicacion(self, plantacion):
        if not plantacion.fk_Era or not plantacion.fk_Era.fk_lote:
            raise ValueError("La plantación no tiene una ubicación válida (Lote/Era)")
        
        # Validar que la era tiene sensor de humedad del suelo
        if not Sensor.objects.filter(fk_eras=plantacion.fk_Era, tipo='HUM_T').exists():
            raise ValueError("La era no tiene sensor de humedad del suelo (HUM_T)")

    def _determinar_kc(self, plantacion, kc_param):
        if kc_param:
            try:
                return float(kc_param), None
            except ValueError:
                raise ValueError("Valor Kc inválido, debe ser un número")
        
        dias_desde_siembra = (timezone.now().date() - plantacion.fechaSiembra).days
        try:
            kc_obj = CoeficienteCultivo.objects.filter(
                cultivo=plantacion.fk_Cultivo,
                dias_desde_siembra__lte=dias_desde_siembra
            ).order_by('-dias_desde_siembra').first()
            
            if kc_obj:
                return kc_obj.kc_valor, kc_obj
            else:
                # Valor predeterminado basado en el tipo de cultivo
                return 0.7, None
        except Exception:
            return 0.7, None

    def _obtener_datos_sensores(self, plantacion):
        era = plantacion.fk_Era
        lote = era.fk_lote if era else None

        # Sensores de la era (obligatorio HUM_T en era)
        sensores_era = Sensor.objects.filter(
            fk_eras=era,
            tipo__in=self.SENSORES_REQUERIDOS
        ).values('tipo').annotate(promedio=Avg('valor'))
        
        # Sensores del lote (excepto HUM_T que debe estar en era)
        sensores_lote = Sensor.objects.filter(
            fk_lote=lote,
            tipo__in=[s for s in self.SENSORES_REQUERIDOS if s != 'HUM_T']
        ).values('tipo').annotate(promedio=Avg('valor'))
        
        # Combinar resultados
        datos = {}
        for s in list(sensores_era) + list(sensores_lote):
            tipo = s['tipo']
            # Priorizar datos de era sobre lote
            if tipo not in datos:
                datos[tipo] = float(s['promedio'])
        
        # Validar sensores faltantes
        faltantes = [s for s in self.SENSORES_REQUERIDOS if s not in datos]
        if faltantes:
            raise ValueError(
                f"Sensores faltantes: {', '.join(faltantes)}. " 
                f"Verifique que existen registros para estos sensores."
            )

        return datos

    def _calcular_evapotranspiracion(self, datos, kc, kc_obj):
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
            
            # 3. Radiación neta (Rn) - Simplificada sin onda larga
            rn = (1 - self.ALBEDO) * rad_solar  # MJ/m²/día
            
            # 4. Cálculo ET0 (Penman-Monteith FAO 56)
            numerador = (0.408 * delta * rn) + (self.GAMMA * (900 / (temp + 273)) * vel_viento_ms * (es - ea))
            denominador = delta + self.GAMMA * (1 + 0.34 * vel_viento_ms)
            et0 = numerador / denominador  # mm/día
            
            # 5. Factor de estrés hídrico (Ks)
            ks = 1.0
            hum_suelo = datos['HUM_T']
            if kc_obj and kc_obj.humedad_optima_min is not None and kc_obj.humedad_optima_max is not None:
                if hum_suelo < kc_obj.humedad_optima_min:
                    ks = max(0.2, hum_suelo / kc_obj.humedad_optima_min)
                elif hum_suelo > kc_obj.humedad_optima_max:
                    reduccion = min(0.5, (hum_suelo - kc_obj.humedad_optima_max) / (100 - kc_obj.humedad_optima_max))
                    ks = 1.0 - reduccion
            
            # 6. ET real = ET0 * Kc * Ks
            et_real = max(et0 * kc * ks, 0)
            return et_real
            
        except KeyError as e:
            logger.error(f"Dato de sensor faltante: {str(e)}")
            raise ValueError(f"Error en datos de sensores: {str(e)}")
        except ZeroDivisionError:
            logger.error("División por cero en cálculo de ET")
            return 0.0

    def _construir_respuesta(self, et_real, kc, plantacion, datos_sensores, kc_obj):
        alerta_et = None
        alerta_humedad = None
        
        if kc_obj:
            # Alertas para ET
            if kc_obj.et_minima and et_real < kc_obj.et_minima:
                alerta_et = {
                    'tipo': 'advertencia',
                    'mensaje': f'ET baja ({et_real:.2f}mm) - Posible exceso de riego',
                    'umbral_min': float(kc_obj.et_minima),
                    'umbral_max': float(kc_obj.et_maxima) if kc_obj.et_maxima else None
                }
            elif kc_obj.et_maxima and et_real > kc_obj.et_maxima:
                alerta_et = {
                    'tipo': 'peligro',
                    'mensaje': f'ET alta ({et_real:.2f}mm) - Riesgo de estrés hídrico',
                    'umbral_min': float(kc_obj.et_minima) if kc_obj.et_minima else None,
                    'umbral_max': float(kc_obj.et_maxima)
                }
            
            # Alertas para humedad del suelo
            if 'HUM_T' in datos_sensores:
                hum_suelo = datos_sensores['HUM_T']
                if kc_obj.humedad_optima_min and hum_suelo < kc_obj.humedad_optima_min:
                    alerta_humedad = {
                        'tipo': 'peligro',
                        'mensaje': f'Humedad del suelo crítica: {hum_suelo:.1f}% (Mínimo óptimo: {kc_obj.humedad_optima_min}%)'
                    }
                elif kc_obj.humedad_optima_max and hum_suelo > kc_obj.humedad_optima_max:
                    alerta_humedad = {
                        'tipo': 'advertencia',
                        'mensaje': f'Humedad del suelo alta: {hum_suelo:.1f}% (Máximo óptimo: {kc_obj.humedad_optima_max}%)'
                    }

        return {
            'evapotranspiracion_mm_dia': round(et_real, 2),
            'kc': round(kc, 2),
            'alerta_et': alerta_et,
            'alerta_humedad': alerta_humedad,
            'detalles': {
                'cultivo': plantacion.fk_Cultivo.nombre if plantacion.fk_Cultivo else 'Desconocido',
                'lote': plantacion.fk_Era.fk_lote.nombre if plantacion.fk_Era else 'Desconocido',
                'fecha_siembra': plantacion.fechaSiembra,
                'dias_siembra': (timezone.now().date() - plantacion.fechaSiembra).days
            },
            'sensor_data': {
                'temperatura': round(datos_sensores['TEM'], 2),
                'viento': round(datos_sensores['VIE'], 2),
                'iluminacion': round(datos_sensores['LUM'], 2),
                'humedad_aire': round(datos_sensores['HUM_A'], 2),
                'humedad_suelo': round(datos_sensores['HUM_T'], 2)
            }
        }
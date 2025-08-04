from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Prefetch
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.trazabilidad.api.models.SemillerosModel import Semilleros
from apps.finanzas.api.models.historialBeneficioCosto import HistorialBeneficioCosto
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas

class ListCultivoEconomicViewSet(viewsets.ViewSet):
    """
    ViewSet para operaciones económicas de cultivos
    Incluye endpoints para:
    - Listado de resúmenes económicos de todos los cultivos
    - Historial de beneficio-costo con filtros
    """
    
    @action(detail=False, methods=['get'])
    def resumen_economico(self, request):
        try:
            prefetch_plantaciones = Prefetch(
                'plantaciones_set',
                queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('cosechas_set', queryset=Cosechas.objects.all())
                )
            )
            prefetch_actividades = Prefetch(
                'actividades_set',
                queryset=Actividades.objects.prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )
            )
            cultivos = Cultivos.objects.select_related('fk_Especie').prefetch_related(
                'semilleros_set',
                prefetch_plantaciones,
                prefetch_actividades  # Usamos solo el Prefetch personalizado
            ).all()
            resumenes = []
            for cultivo in cultivos:
                nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
                actividades = cultivo.actividades_set.all()
                plantaciones = cultivo.plantaciones_set.all()
                afecciones_ids = Afecciones.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
                controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).prefetch_related(
                    Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta')),
                    Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                    'tiempoactividadcontrol_set'
                )
                
                insumos_actividades = UsosInsumos.objects.filter(fk_Actividad__in=actividades).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                insumos_controles = UsosInsumos.objects.filter(fk_Control__in=controles).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
                total_insumos = int(round(insumos_actividades + insumos_controles))
                
                mano_obra_actividades = TiempoActividadControl.objects.filter(fk_actividad__in=actividades).aggregate(total=Sum('valorTotal'))['total'] or 0
                mano_obra_controles = TiempoActividadControl.objects.filter(fk_control__in=controles).aggregate(total=Sum('valorTotal'))['total'] or 0
                total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
                
                # Depreciación
                total_depreciacion = 0
                # Actividades
                for actividad in actividades:
                    tiempos = actividad.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                    for uso_herramienta in actividad.usosherramientas_set.all():
                        herramienta = uso_herramienta.fk_Herramienta
                        if herramienta:
                            costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)
                            depreciacion = costo_por_minuto * tiempos * uso_herramienta.unidades
                            total_depreciacion += depreciacion
                # Controles
                for control in controles:
                    tiempos = control.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                    for uso_herramienta in control.usosherramientas_set.all():
                        herramienta = uso_herramienta.fk_Herramienta
                        if herramienta:
                            costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)
                            depreciacion = costo_por_minuto * tiempos * uso_herramienta.unidades
                            total_depreciacion += depreciacion
                
                total_depreciacion = int(round(total_depreciacion))
                
                total_ventas = Ventas.objects.filter(fk_Cosecha__id__in=Cosechas.objects.filter(
                    fk_Plantacion__in=plantaciones).values_list('id', flat=True)
                ).aggregate(total=Sum('valorTotal'))['total'] or 0
                
                total_costos = total_insumos + total_mano_obra + total_depreciacion
                beneficio = total_ventas - total_costos
                relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0.0
                
                primer_semillero = cultivo.semilleros_set.order_by('fechasiembra').first()
                primera_plantacion = plantaciones.order_by('fechaSiembra').first()
                fecha_siembra = (
                    primer_semillero.fechasiembra if primer_semillero else
                    primera_plantacion.fechaSiembra if primera_plantacion else
                    None
                )
                
                ultimo_historial = HistorialBeneficioCosto.objects.filter(fk_Cultivo=cultivo).order_by('-fecha_registro').first()
                crear_registro = True
                if ultimo_historial:
                    from math import isclose
                    crear_registro = (
                        ultimo_historial.costo_insumos != total_insumos or
                        ultimo_historial.total_mano_obra != total_mano_obra or
                        ultimo_historial.total_depreciacion != total_depreciacion or
                        ultimo_historial.total_costos != total_costos or
                        ultimo_historial.total_ventas != total_ventas or
                        ultimo_historial.beneficio != beneficio or
                        not isclose(ultimo_historial.relacion_beneficio_costo, relacion_bc, rel_tol=1e-5)
                    )
                
                if crear_registro:
                    HistorialBeneficioCosto.objects.create(
                        fk_Cultivo=cultivo,
                        costo_insumos=total_insumos,
                        total_mano_obra=total_mano_obra,
                        total_depreciacion=total_depreciacion,
                        total_costos=total_costos,
                        total_ventas=total_ventas,
                        beneficio=beneficio,
                        relacion_beneficio_costo=relacion_bc
                    )
                
                resumen = {
                    "cultivo_id": cultivo.id,
                    "nombre_especie": nombre_especie,
                    "nombre_cultivo": cultivo.nombre,
                    "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                    "costo_insumos": total_insumos,
                    "total_mano_obra": total_mano_obra,
                    "total_depreciacion": total_depreciacion,
                    "total_costos": total_costos,
                    "total_ventas": int(round(total_ventas)),
                    "beneficio": int(round(beneficio)),
                    "relacion_beneficio_costo": relacion_bc
                }
                resumenes.append(resumen)
            return Response(resumenes)
        except Exception as e:
            return Response(
                {"error": f"Error al obtener resúmenes: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='historial-beneficio-costo')
    def historial_beneficio_costo(self, request):
        try:
            cultivos_ids = request.query_params.getlist('cultivos_ids[]', None)
            fecha_inicio = request.query_params.get('fecha_inicio', None)
            fecha_fin = request.query_params.get('fecha_fin', None)
            historial_qs = HistorialBeneficioCosto.objects.select_related('fk_Cultivo')
            if cultivos_ids:
                historial_qs = historial_qs.filter(fk_Cultivo__id__in=cultivos_ids)
            if fecha_inicio:
                historial_qs = historial_qs.filter(fecha_registro__gte=fecha_inicio)
            if fecha_fin:
                historial_qs = historial_qs.filter(fecha_registro__lte=fecha_fin)
            historial_qs = historial_qs.order_by('fk_Cultivo__id', '-fecha_registro')
            historial_data = [{
                "cultivo_id": registro.fk_Cultivo.id,
                "nombre_cultivo": registro.fk_Cultivo.nombre,
                "fecha_registro": registro.fecha_registro.strftime("%Y-%m-%d %H:%M:%S"),
                "costo_insumos": registro.costo_insumos,
                "total_mano_obra": registro.total_mano_obra,
                "total_depreciacion": registro.total_depreciacion,
                "total_costos": registro.total_costos,
                "total_ventas": registro.total_ventas,
                "beneficio": registro.beneficio,
                "relacion_beneficio_costo": registro.relacion_beneficio_costo
            } for registro in historial_qs]
            return Response(historial_data)
        except Cultivos.DoesNotExist:
            return Response(
                {"error": "Uno o más cultivos no encontrados"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al obtener historial: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
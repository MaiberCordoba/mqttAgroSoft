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
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas

class CultivoEconomicViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['get'], url_path='resumen-economico')
    def resumen_economico(self, request, pk=None):
        try:
            cultivo = Cultivos.objects.select_related('fk_Especie').prefetch_related(
                'semilleros_set',
                Prefetch('plantaciones_set', queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('cosechas_set', queryset=Cosechas.objects.all())
                ))
            ).get(pk=pk)
            
            nombre_especie = cultivo.fk_Especie.nombre if cultivo.fk_Especie else None
            actividades = Actividades.objects.filter(fk_Cultivo=cultivo).select_related(
                'fk_TipoActividad', 'fk_Usuario'
            ).prefetch_related(
                'tiempoactividadcontrol_set',
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta'))
            )
            
            plantaciones = cultivo.plantaciones_set.all()
            afecciones_ids = Afecciones.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
            controles = Controles.objects.filter(fk_Afeccion__in=afecciones_ids).select_related(
                'fk_TipoControl', 'fk_Afeccion__fk_Plaga', 'fk_Afeccion__fk_Plaga__fk_Tipo'
            ).prefetch_related(
                Prefetch('usosinsumos_set', queryset=UsosInsumos.objects.select_related('fk_UnidadMedida')),
                Prefetch('usosherramientas_set', queryset=UsosHerramientas.objects.select_related('fk_Herramienta'))
            )
            
            # Costos de insumos
            insumos_actividades = UsosInsumos.objects.filter(fk_Actividad__in=actividades).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            insumos_controles = UsosInsumos.objects.filter(fk_Control__in=controles).aggregate(total=Sum('costoUsoInsumo'))['total'] or 0
            total_insumos = int(round(insumos_actividades + insumos_controles))
            
            # Costos de mano de obra
            mano_obra_actividades = TiempoActividadControl.objects.filter(fk_actividad__in=actividades).aggregate(total=Sum('valorTotal'))['total'] or 0
            mano_obra_controles = TiempoActividadControl.objects.filter(fk_control__in=controles).aggregate(total=Sum('valorTotal'))['total'] or 0
            total_mano_obra = int(round(mano_obra_actividades + mano_obra_controles))
            
            # Costos de depreciación (actividades + controles)
            total_depreciacion = 0
            
            # Depreciación para actividades
            for actividad in actividades:
                tiempos = actividad.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                for uso_herramienta in actividad.usosherramientas_set.all():
                    herramienta = uso_herramienta.fk_Herramienta
                    if herramienta:
                        costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)  # 5 años en minutos
                        depreciacion = costo_por_minuto * tiempos * uso_herramienta.unidades
                        total_depreciacion += depreciacion
            
            # Depreciación para controles
            for control in controles:
                tiempos = control.tiempoactividadcontrol_set.aggregate(total_tiempo=Sum('tiempo'))['total_tiempo'] or 0
                for uso_herramienta in control.usosherramientas_set.all():
                    herramienta = uso_herramienta.fk_Herramienta
                    if herramienta:
                        costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)
                        depreciacion = costo_por_minuto * tiempos * uso_herramienta.unidades
                        total_depreciacion += depreciacion
            
            total_depreciacion = int(round(total_depreciacion))
            
            # Ventas
            cosechas_ids = Cosechas.objects.filter(fk_Plantacion__in=plantaciones).values_list('id', flat=True)
            ventas = Ventas.objects.filter(fk_Cosecha__id__in=cosechas_ids).select_related('fk_UnidadMedida')
            total_ventas = ventas.aggregate(total=Sum('valorTotal'))['total'] or 0
            
            # Detalle de actividades
            detalle_actividades = []
            for actividad in actividades:
                tiempos = actividad.tiempoactividadcontrol_set.all().aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                
                insumos_actividad = []
                total_insumos_actividad = 0
                for insumo in actividad.usosinsumos_set.all():
                    insumos_actividad.append({
                        "nombre": insumo.fk_Insumo.nombre,
                        "cantidad": insumo.cantidadProducto,
                        "unidad": insumo.fk_UnidadMedida.nombre if insumo.fk_UnidadMedida else None,
                        "costo": insumo.costoUsoInsumo
                    })
                    total_insumos_actividad += insumo.costoUsoInsumo
                
                # Depreciación por actividad
                depreciacion_actividad = 0
                herramientas_actividad = []
                tiempos_actividad = tiempos['total_tiempo'] or 0
                for uso_herramienta in actividad.usosherramientas_set.all():
                    herramienta = uso_herramienta.fk_Herramienta
                    if herramienta:
                        costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)
                        depreciacion = costo_por_minuto * tiempos_actividad * uso_herramienta.unidades
                        depreciacion_actividad += depreciacion
                        herramientas_actividad.append({
                            "nombre": herramienta.nombre,
                            "unidades": uso_herramienta.unidades,
                            "tiempo_uso": tiempos_actividad,
                            "depreciacion": int(round(depreciacion))
                        })
                
                detalle_actividades.append({
                    "tipo_actividad": actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else None,
                    "responsable": actividad.fk_Usuario.nombre if actividad.fk_Usuario else None,
                    "fecha": actividad.fecha.strftime("%Y-%m-%d"),
                    "tiempo_total": tiempos_actividad,
                    "costo_mano_obra": tiempos.get('total_valor', 0) or 0,
                    "insumos": insumos_actividad,
                    "total_insumos_actividad": total_insumos_actividad,
                    "herramientas": herramientas_actividad,
                    "total_depreciacion_actividad": int(round(depreciacion_actividad))
                })
            
            # Detalle de controles
            detalle_controles = []
            for control in controles:
                tiempos = control.tiempoactividadcontrol_set.all().aggregate(
                    total_tiempo=Sum('tiempo'),
                    total_valor=Sum('valorTotal')
                )
                
                insumos_control = []
                total_insumos_control = 0
                for insumo in control.usosinsumos_set.all():
                    insumos_control.append({
                        "nombre": insumo.fk_Insumo.nombre,
                        "cantidad": insumo.cantidadProducto,
                        "unidad": insumo.fk_UnidadMedida.nombre if insumo.fk_UnidadMedida else None,
                        "costo": insumo.costoUsoInsumo
                    })
                    total_insumos_control += insumo.costoUsoInsumo
                
                # Depreciación por control
                depreciacion_control = 0
                herramientas_control = []
                tiempos_control = tiempos['total_tiempo'] or 0
                for uso_herramienta in control.usosherramientas_set.all():
                    herramienta = uso_herramienta.fk_Herramienta
                    if herramienta:
                        costo_por_minuto = herramienta.valorTotal / (5 * 365 * 24 * 60)
                        depreciacion = costo_por_minuto * tiempos_control * uso_herramienta.unidades
                        depreciacion_control += depreciacion
                        herramientas_control.append({
                            "nombre": herramienta.nombre,
                            "unidades": uso_herramienta.unidades,
                            "tiempo_uso": tiempos_control,
                            "depreciacion": int(round(depreciacion))
                        })
                
                detalle_controles.append({
                    "descripcion": control.descripcion,
                    "fecha": control.fechaControl.strftime("%Y-%m-%d"),
                    "tipo_control": control.fk_TipoControl.nombre if control.fk_TipoControl else None,
                    "plaga": control.fk_Afeccion.fk_Plaga.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tipo_plaga": control.fk_Afeccion.fk_Plaga.fk_Tipo.nombre if control.fk_Afeccion.fk_Plaga else None,
                    "tiempo_total": tiempos_control,
                    "costo_mano_obra": tiempos.get('total_valor', 0) or 0,
                    "insumos": insumos_control,
                    "total_insumos_control": total_insumos_control,
                    "herramientas": herramientas_control,
                    "total_depreciacion_control": int(round(depreciacion_control))
                })
            
            # Detalle de cosechas (AGREGADO)
            detalle_cosechas = []
            for plantacion in plantaciones:
                for cosecha in plantacion.cosechas_set.all():
                    detalle_cosechas.append({
                        "cantidad": cosecha.cantidad,
                        "unidad": cosecha.fk_UnidadMedida.nombre if cosecha.fk_UnidadMedida else None,
                        "fecha": cosecha.fecha.strftime("%Y-%m-%d"),
                        "plantacion_id": plantacion.id
                    })
            
            # Detalle de ventas (AGREGADO)
            detalle_ventas = []
            for venta in ventas:
                detalle_ventas.append({
                    "cantidad": venta.cantidad,
                    "unidad": venta.fk_UnidadMedida.nombre if venta.fk_UnidadMedida else None,
                    "fecha": venta.fecha.strftime("%Y-%m-%d"),
                    "valor_total": venta.valorTotal,
                    "cosecha_id": venta.fk_Cosecha.id if venta.fk_Cosecha else None
                })
            
            # Cálculos finales
            total_costos = total_insumos + total_mano_obra + total_depreciacion
            beneficio = total_ventas - total_costos
            relacion_bc = round(total_ventas / total_costos, 2) if total_costos > 0 else 0
            
            # Fecha de siembra
            primer_semillero = cultivo.semilleros_set.order_by('fechasiembra').first()
            primera_plantacion = plantaciones.order_by('fechaSiembra').first()
            fecha_siembra = (
                primer_semillero.fechasiembra if primer_semillero else
                primera_plantacion.fechaSiembra if primera_plantacion else
                None
            )
            
            # Respuesta
            data = {
                "cultivo_id": cultivo.id,
                "nombre_especie": nombre_especie,
                "nombre_cultivo": cultivo.nombre,
                "fecha_siembra": fecha_siembra.strftime("%Y-%m-%d") if fecha_siembra else None,
                "total_insumos": total_insumos,
                "total_mano_obra": total_mano_obra,
                "total_depreciacion": total_depreciacion,
                "total_costos": total_costos,
                "total_ventas": int(round(total_ventas)),
                "beneficio": int(round(beneficio)),
                "relacion_beneficio_costo": relacion_bc,
                "detalle": {
                    "actividades": {
                        "total": actividades.count(),
                        "actividades_detalladas": detalle_actividades
                    },
                    "controles": {
                        "total": controles.count(),
                        "controles_detallados": detalle_controles
                    },
                    "cosechas": {
                        "total": len(detalle_cosechas),
                        "cosechas_detalladas": detalle_cosechas
                    },
                    "ventas": {
                        "total": ventas.count(),
                        "ventas_detalladas": detalle_ventas
                    }
                }
            }
            
            return Response(data)
            
        except Cultivos.DoesNotExist:
            return Response({"error": "Cultivo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error al obtener resumen: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
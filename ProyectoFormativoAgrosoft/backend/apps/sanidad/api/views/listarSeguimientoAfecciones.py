from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Prefetch
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.sanidad.api.models.controlesModel import Controles
from rest_framework import status

class ListSeguimientoAfeccionesViewSet(viewsets.ViewSet):
    """
    ViewSet para listar los cultivos con información relevante sin cálculos adicionales.
    Incluye endpoint para obtener un listado de cultivos con sus relaciones.
    """
    
    @action(detail=False, methods=['get'], url_path='seguimiento-de-afecciones')
    def resumen(self, request):
        """
        Obtiene un listado de cultivos con sus relaciones sin realizar cálculos adicionales.
        ---
        Retorna:
        - Lista de cultivos con:
          * ID, nombre de especie, fecha de siembra, unidades
          * Actividades, plantaciones, afecciones, controles, eras y lotes
        """
        try:
            # Obtener todos los cultivos con relaciones anidadas optimizadas
            cultivos = Cultivos.objects.select_related(
                'fk_Semillero',
                'fk_Semillero__fk_especie',
                'fk_Semillero__fk_especie__fk_tipoespecie'
            ).prefetch_related(
                Prefetch('actividades_set', queryset=Actividades.objects.select_related(
                    'fk_TipoActividad',
                    'fk_Usuario'
                )),
                Prefetch('plantaciones_set', queryset=Plantaciones.objects.select_related(
                    'fk_Era',
                    'fk_Era__fk_lote'
                ).prefetch_related(
                    Prefetch('afecciones_set', queryset=Afecciones.objects.select_related(
                        'fk_Plaga',
                        'fk_Plaga__fk_Tipo'
                    ).prefetch_related(
                        Prefetch('controles_set', queryset=Controles.objects.select_related('fk_TipoControl'))
                    ))
                ))
            ).all()

            resumenes = []

            for cultivo in cultivos:
                # Obtener nombre de la especie
                nombre_especie = cultivo.fk_Semillero.fk_especie.nombre if cultivo.fk_Semillero and cultivo.fk_Semillero.fk_especie else None
                descripcion_especie = cultivo.fk_Semillero.fk_especie.descripcion if cultivo.fk_Semillero and cultivo.fk_Semillero.fk_especie else None

                # Obtener actividades relacionadas
                actividades = cultivo.actividades_set.all()
                detalle_actividades = [
                    {
                        "tipo_actividad": actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else None,
                        "responsable": actividad.fk_Usuario.nombre if actividad.fk_Usuario else None,
                        "fecha": actividad.fecha.strftime("%Y-%m-%d") if actividad.fecha else None,
                    }
                    for actividad in actividades
                ]

                # Obtener plantaciones relacionadas
                plantaciones = cultivo.plantaciones_set.all()
                detalle_plantaciones = []
                for plantacion in plantaciones:
                    # Obtener afecciones relacionadas
                    afecciones = plantacion.afecciones_set.all()
                    detalle_afecciones = []
                    for afeccion in afecciones:
                        # Obtener controles relacionados
                        controles = afeccion.controles_set.all()
                        detalle_controles = [
                            {
                                "descripcion": control.descripcion,
                                "fecha_control": control.fechaControl.strftime("%Y-%m-%d") if control.fechaControl else None,
                                "tipo_control": control.fk_TipoControl.nombre if control.fk_TipoControl else None,
                            }
                            for control in controles
                        ]

                        # Obtener información de la plaga
                        detalle_plaga = {
                            "nombre": afeccion.fk_Plaga.nombre if afeccion.fk_Plaga else None,
                            "descripcion": afeccion.fk_Plaga.descripcion if afeccion.fk_Plaga else None,
                        } if afeccion.fk_Plaga else None

                        detalle_afecciones.append({
                            "estado": afeccion.estado,
                            "plaga": detalle_plaga,
                            "controles": {
                                "total": len(detalle_controles),
                                "controles_detallados": detalle_controles
                            }
                        })

                    # Obtener información de la era y el lote
                    detalle_era = {
                        "tipo": plantacion.fk_Era.tipo if plantacion.fk_Era else None,
                        "lote": {
                            "nombre": plantacion.fk_Era.fk_lote.nombre if plantacion.fk_Era and plantacion.fk_Era.fk_lote else None,
                            "descripcion": plantacion.fk_Era.fk_lote.descripcion if plantacion.fk_Era and plantacion.fk_Era.fk_lote else None,
                        } if plantacion.fk_Era and plantacion.fk_Era.fk_lote else None
                    } if plantacion.fk_Era else None

                    detalle_plantaciones.append({
                        "creado": plantacion.creado.strftime("%Y-%m-%d %H:%M:%S") if plantacion.creado else None,
                        "era": detalle_era,
                        "afecciones": {
                            "total": len(detalle_afecciones),
                            "afecciones_detalladas": detalle_afecciones
                        }
                    })

                # Obtener información del semillero
                detalle_semillero = {
                    "unidades": cultivo.fk_Semillero.unidades if cultivo.fk_Semillero else None,
                    "fecha_siembra": cultivo.fk_Semillero.fechasiembra.strftime("%Y-%m-%d") if cultivo.fk_Semillero and cultivo.fk_Semillero.fechasiembra else None,
                    "fecha_estimada": cultivo.fk_Semillero.fechaestimada.strftime("%Y-%m-%d") if cultivo.fk_Semillero and cultivo.fk_Semillero.fechaestimada else None,
                    "especie": {
                        "nombre": nombre_especie,
                        "descripcion": descripcion_especie,
                    } if nombre_especie and descripcion_especie else None
                } if cultivo.fk_Semillero else None

                # Estructurar respuesta
                resumen = {
                    "cultivo_id": cultivo.id,
                    "fecha_siembra": cultivo.fechaSiembra.strftime("%Y-%m-%d") if cultivo.fechaSiembra else None,
                    "unidades": cultivo.unidades,
                    "nombre": nombre_especie,
                    "semillero": detalle_semillero,
                    "detalle": {
                        "plantaciones": {
                            "total": len(detalle_plantaciones),
                            "plantaciones_detalladas": detalle_plantaciones
                        }
                    }
                }
                
                resumenes.append(resumen)

            return Response(resumenes)
        
        except Exception as e:
            return Response(
                {"error": f"Error al obtener resúmenes: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
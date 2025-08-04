from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Prefetch
from apps.finanzas.api.models.cultivos import Cultivos
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.sanidad.api.models.controlesModel import Controles
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones

class ListSeguimientoAfeccionesViewSet(viewsets.ViewSet):
    """
    ViewSet para listar los cultivos con información relevante de afecciones y controles.
    """

    @action(detail=False, methods=['get'], url_path='seguimiento-de-afecciones')
    def seguimiento(self, request):
        try:
            cultivos = Cultivos.objects.select_related(
                'fk_Semillero__fk_especie'
            ).prefetch_related(
                Prefetch('plantaciones_set', queryset=Plantaciones.objects.prefetch_related(
                    Prefetch('afecciones_set', queryset=Afecciones.objects.prefetch_related(
                        Prefetch('controles_set', queryset=Controles.objects.select_related('fk_TipoControl'))
                    ))
                ))
            ).all()

            resumenes = []

            for cultivo in cultivos:
                nombre_especie = cultivo.fk_Semillero.fk_especie.nombre if cultivo.fk_Semillero and cultivo.fk_Semillero.fk_especie else None
                plantaciones = cultivo.plantaciones_set.all()

                detalle_afecciones = []

                for plantacion in plantaciones:
                    for afeccion in plantacion.afecciones_set.all():
                        controles = afeccion.controles_set.all()

                        detalle_controles = [{
                            "control_id": control.id,
                            "descripcion": control.descripcion,
                            "fecha_control": control.fechaControl.strftime("%Y-%m-%d") if control.fechaControl else None,
                            "tipo_control": control.fk_TipoControl.nombre if control.fk_TipoControl else None,
                        } for control in controles]

                        detalle_afecciones.append({
                            "afeccion_id": afeccion.id,
                            "descripcion": afeccion.descripcion,
                            "plaga": afeccion.fk_Plaga.nombre if afeccion.fk_Plaga else None,
                            "controles": detalle_controles,
                        })

                resumen = {
                    "cultivo_id": cultivo.id,
                    "fecha_siembra": cultivo.fechaSiembra.strftime("%Y-%m-%d") if cultivo.fechaSiembra else None,
                    "unidades": cultivo.unidades,
                    "nombre": nombre_especie,
                    "detalle": {
                        "afecciones": {
                            "total": len(detalle_afecciones),
                            "afecciones_detalladas": detalle_afecciones
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

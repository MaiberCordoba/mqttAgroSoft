# apps/finanzas/api/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades
from apps.finanzas.api.models.actividades import Actividades
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from apps.notificaciones.api.services import NotificationService

class ViewActividades(ModelViewSet):
    serializer_class = SerializerActividades
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si el usuario es aprendiz solo ve las actividades del mismo 
        if (user.rol == "aprendiz"):  
            return  Actividades.objects.filter(fk_Usuario=user)
            # Si el usuario es visitante no ve ninguna actividad
        elif (user.rol == "visitante"):  
            return ("no tienes permitida esta vista")
        
        # de tener otro rol , devuelve todas las actividades
        return Actividades.objects.all()

    def perform_create(self, serializer):
        actividad = serializer.save()

        if actividad.fk_Usuario is not None:
            try:
                ubicacion_info = ""
                if actividad.fk_Plantacion:
                    plantacion = actividad.fk_Plantacion
                    era_info = ""
                    if plantacion.fk_Era:
                        era_info = (
                            f"\nEra: {plantacion.fk_Era.tipo}"
                            f"\nLote: {plantacion.fk_Era.fk_lote.nombre if plantacion.fk_Era.fk_lote else 'No especificado'}"
                        )
                    ubicacion_info = (
                        f"\nCultivo: {str(plantacion.fk_Cultivo) if plantacion.fk_Cultivo else 'No especificado'}"
                        f"{era_info}"
                    )
                elif actividad.fk_Cultivo:
                    ubicacion_info = f"\nCultivo: {str(actividad.fk_Cultivo)}"

                mensaje = (
                    f"Tienes una nueva actividad asignada:\n\n"
                    f"Título: {actividad.titulo}\n"
                    f"Descripción: {actividad.descripcion}\n"
                    f"Fecha: {actividad.fecha.strftime('%d/%m/%Y') if actividad.fecha else 'No especificada'}\n"
                    f"Tipo: {actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else 'No especificado'}\n"
                    f"Estado: {actividad.get_estado_display()}"
                    f"{ubicacion_info}"
                )

                # Usar el servicio de notificaciones
                NotificationService.create_notification(
                    user=actividad.fk_Usuario,
                    title=f"Nueva actividad: {actividad.titulo}",
                    message=mensaje,
                    notification_type="activity",
                    related_object=actividad,
                    send_email=True
                )

            except Exception as e:
                print(f"Error en el envío de notificación: {e}")
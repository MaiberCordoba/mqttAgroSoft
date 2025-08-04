# apps/sanidad/api/views.py
from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.serializers.controlesSerializer import ControlesModelSerializer
from apps.sanidad.api.models.controlesModel import Controles
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from apps.notificaciones.api.services import NotificationService

class ControleslModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ControlesModelSerializer

    def get_queryset(self):
        user = self.request.user
        print(f"[DEBUG] Usuario autenticado: {user}, rol: {user.rol}")  # Añadido para depuración
        # Si el usuario tiene rol admin, instructo o pasante, devuelve todos los controles
        if (user.rol == "admin" or user.rol == "instructor" or user.rol == "pasante"): 
            qs = Controles.objects.all()
            print(f"[DEBUG] Admin - controles totales: {qs.count()}")
            return qs
        # Si no, devuelve solo sus controles
        qs = Controles.objects.filter(fk_Usuario=user)
        print(f"[DEBUG] Usuario normal - controles propios: {qs.count()}")
        return qs

    def perform_create(self, serializer):
        control = serializer.save()
        if control.fk_Usuario is not None:
            try:
                fecha_control = control.fechaControl.strftime("%d/%m/%Y")
                descripcion = control.descripcion
                afeccion_nombre = control.fk_Afeccion.fk_Plaga.nombre if control.fk_Afeccion and control.fk_Afeccion.fk_Plaga else "Sin especificar"
                tipo_afeccion = control.fk_Afeccion.fk_Plaga.fk_Tipo.nombre if (
                    control.fk_Afeccion and
                    control.fk_Afeccion.fk_Plaga and
                    control.fk_Afeccion.fk_Plaga.fk_Tipo
                ) else "Sin especificar"

                cultivo_nombre = ""
                if control.fk_Afeccion and control.fk_Afeccion.fk_Plantacion:
                    if control.fk_Afeccion.fk_Plantacion.fk_Cultivo:
                        especie = control.fk_Afeccion.fk_Plantacion.fk_Cultivo.fk_Especie.nombre if control.fk_Afeccion.fk_Plantacion.fk_Cultivo.fk_Especie else ""
                        variedad = control.fk_Afeccion.fk_Plantacion.fk_Cultivo.nombre
                        cultivo_nombre = f"{especie} {variedad}".strip()

                tipo_control = control.fk_TipoControl.nombre if control.fk_TipoControl else "Sin especificar"

                mensaje = (
                    f"Fecha de control: {fecha_control}\n\n"
                    f"Descripción: {descripcion}\n\n"
                    f"Afección: {afeccion_nombre}\n\n"
                    f"Tipo de afección: {tipo_afeccion}\n\n"
                    f"Cultivo: {cultivo_nombre if cultivo_nombre else 'Sin especificar'}\n\n"
                    f"Tipo de control: {tipo_control}"
                )

                NotificationService.create_notification(
                    user=control.fk_Usuario,
                    title=f"Nuevo control asignado - {fecha_control}",
                    message=mensaje,
                    notification_type="control",
                    related_object=control,
                    send_email=True
                )
            except Exception as e:
                print(f"Error en el envío de notificación: {e}")
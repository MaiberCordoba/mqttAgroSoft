from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.serializers.serializerTiempoActividadControl import SerializerTiempoActividadControl
from django.db.models import Sum, F, Q
from django.db.models.functions import TruncMonth

class ViewTiempoActividadControl(ModelViewSet):
    queryset = TiempoActividadControl.objects.all()
    serializer_class = SerializerTiempoActividadControl

    def get_queryset(self):
        queryset = super().get_queryset()
        usuario_id = self.request.query_params.get('usuario_id')
        if usuario_id:
            try:
                usuario_id = int(usuario_id)
                queryset = queryset.filter(
                    Q(fk_actividad__fk_Usuario=usuario_id) | Q(fk_control__fk_Usuario=usuario_id)
                )
            except ValueError:
                pass  # Ignorar si usuario_id no es válido
            except Exception as e:
                print(f"Error en filtro de usuario: {str(e)}")
                return queryset  # Devolver sin filtro si falla
        return queryset

class MarcarPagoView(APIView):
    def patch(self, request, pk):
        try:
            registro = TiempoActividadControl.objects.get(pk=pk)
        except TiempoActividadControl.DoesNotExist:
            return Response({"error": "Registro no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        estado_pago = request.data.get('estado_pago')
        if estado_pago not in [choice[0] for choice in TiempoActividadControl.ESTADO_PAGO_CHOICES]:
            return Response({"error": "Estado de pago inválido"}, status=status.HTTP_400_BAD_REQUEST)

        registro.estado_pago = estado_pago
        registro.save()

        serializer = SerializerTiempoActividadControl(registro)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PagarTodoPendienteView(APIView):
    def post(self, request):
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response({"error": "Se requiere usuario_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario_id = int(usuario_id)
            registros = TiempoActividadControl.objects.filter(
                Q(fk_actividad__fk_Usuario=usuario_id) | Q(fk_control__fk_Usuario=usuario_id),
                estado_pago='PENDIENTE'
            )
        except ValueError:
            return Response({"error": "usuario_id debe ser un número"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error en filtro: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        if not registros.exists():
            return Response({"message": "No hay registros pendientes para pagar"}, status=status.HTTP_200_OK)

        # Contar registros antes de actualizar
        num_registros = registros.count()
        total_pagado = sum(reg.valorTotal for reg in registros)

        # Actualizar registros
        registros.update(estado_pago='PAGADO')

        return Response({
            "message": f"Se pagaron {num_registros} registros por un total de ${total_pagado}",
            "total_pagado": total_pagado,
            "registros_pagados": num_registros
        }, status=status.HTTP_200_OK)

class TotalesMensualesView(APIView):
    def get(self, request):
        usuario_id = self.request.query_params.get('usuario_id')
        queryset = TiempoActividadControl.objects.all()
        if usuario_id:
            try:
                usuario_id = int(usuario_id)
                queryset = queryset.filter(
                    Q(fk_actividad__fk_Usuario=usuario_id) | Q(fk_control__fk_Usuario=usuario_id)
                )
            except ValueError:
                return Response({"error": "usuario_id debe ser un número"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"Error en filtro: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        totales = queryset.annotate(
            mes=TruncMonth('fecha')
        ).values('mes').annotate(
            total_pagado=Sum('valorTotal', filter=F('estado_pago') == 'PAGADO'),
            total_pendiente=Sum('valorTotal', filter=F('estado_pago') == 'PENDIENTE')
        ).order_by('mes')

        return Response([{
            "mes": item["mes"].strftime("%Y-%m"),
            "total_pagado": item["total_pagado"] or 0,
            "total_pendiente": item["total_pendiente"] or 0
        } for item in totales])
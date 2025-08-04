from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Usuario
from .serializers import UsuarioSerializer
import pandas as pd
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView


class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]  # Permite a cualquier usuario registrarse
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Devuelve la información del usuario autenticado"""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated], url_path='reporte')
    def reporte_usuarios(self, request):
        """Devuelve un resumen del total de usuarios, activos e inactivos"""
        total = Usuario.objects.count()
        activos = Usuario.objects.filter(estado='activo').count()
        inactivos = Usuario.objects.filter(estado='inactivo').count()

        return Response({
            'total_usuarios': total,
            'usuarios_activos': activos,
            'usuarios_inactivos': inactivos
        })


class RegistroMasivoUsuariosView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]  # Cambiado a autenticado por seguridad

    def post(self, request, *args, **kwargs):
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({'error': 'No se proporcionó ningún archivo.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df = pd.read_excel(archivo)
            # Normalizar nombres de columnas
            df.columns = [col.strip().lower() for col in df.columns]
        except Exception as e:
            return Response({'error': f'Error al leer el archivo: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        required_columns = {'nombre', 'apellido', 'identificacion'}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            return Response({'error': f'Columnas faltantes: {", ".join(missing)}'}, status=status.HTTP_400_BAD_REQUEST)

        errores = []
        registros_exitosos = 0
        
        for index, row in df.iterrows():
            fila = index + 2  # Contar desde fila 2
            
            # Validar campos requeridos
            if any(pd.isna(row.get(col)) for col in required_columns):
                errores.append({
                    'fila': fila,
                    'errores': "Campos requeridos vacíos: nombre, apellido o identificación"
                })
                continue

            try:
                data = {
                    'nombre': str(row['nombre']).strip(),
                    'apellidos': str(row['apellido']).strip(),
                    'identificacion': int(row['identificacion']),
                    'rol': 'visitante'
                }
            except ValueError:
                errores.append({
                    'fila': fila,
                    'errores': "La identificación debe ser un número válido"
                })
                continue
            except Exception as e:
                errores.append({
                    'fila': fila,
                    'errores': f"Error inesperado: {str(e)}"
                })
                continue

            serializer = UsuarioSerializer(data=data)
            if serializer.is_valid():
                try:
                    serializer.save()
                    registros_exitosos += 1
                except Exception as e:
                    errores.append({
                        'fila': fila,
                        'errores': f"Error al guardar: {str(e)}"
                    })
            else:
                errores.append({'fila': fila, 'errores': serializer.errors})

        response_data = {
            'mensaje': f'Registro masivo completado: {registros_exitosos} usuarios creados',
            'exitosos': registros_exitosos,
            'errores': len(errores)
        }
        
        if errores:
            response_data['detalle_errores'] = errores
            status_code = status.HTTP_207_MULTI_STATUS
        else:
            status_code = status.HTTP_201_CREATED

        return Response(response_data, status=status_code)

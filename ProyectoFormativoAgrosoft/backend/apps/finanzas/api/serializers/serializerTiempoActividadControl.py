from rest_framework import serializers
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades
from apps.sanidad.api.serializers.controlesSerializer import ControlesModelSerializer

class SerializerTiempoActividadControl(serializers.ModelSerializer):
    actividad = SerializerActividades(source='fk_actividad', read_only=True)
    control = ControlesModelSerializer(source='fk_control', read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    valorTotal = serializers.IntegerField(read_only=True)
    estado_pago = serializers.ChoiceField(
        choices=TiempoActividadControl.ESTADO_PAGO_CHOICES,
        default='PENDIENTE'
    )

    class Meta:
        model = TiempoActividadControl
        fields = '__all__'
        read_only_fields = ['fecha', 'valorTotal']

    def validate(self, data):
        actividad = data.get('fk_actividad')
        control = data.get('fk_control')

        if actividad and control:
            raise serializers.ValidationError("Solo puede relacionarse con una actividad O un control, no ambos.")
        if not actividad and not control:
            raise serializers.ValidationError("Debe seleccionar una actividad O un control.")

        return data

    def create(self, validated_data):
        unidad = validated_data.get('fk_unidadTiempo')
        salario = validated_data.get('fk_salario')
        tiempo = validated_data.get('tiempo')

        minutos = tiempo * unidad.equivalenciaMinutos
        validated_data['valorTotal'] = minutos * salario.monto_minutos

        # Crear el registro
        instance = super().create(validated_data)

        # Actualizar estado de la actividad si está vinculada
        if instance.fk_actividad:
            actividad = instance.fk_actividad
            actividad.estado = 'CO'
            actividad.save()

        return instance

    def update(self, instance, validated_data):
        unidad = validated_data.get('fk_unidadTiempo', instance.fk_unidadTiempo)
        salario = validated_data.get('fk_salario', instance.fk_salario)
        tiempo = validated_data.get('tiempo', instance.tiempo)

        minutos = tiempo * unidad.equivalenciaMinutos
        validated_data['valorTotal'] = minutos * salario.monto_minutos

        # Actualizar el registro
        instance = super().update(instance, validated_data)

        # Actualizar estado de la actividad si está vinculada
        if instance.fk_actividad:
            actividad = instance.fk_actividad
            actividad.estado = 'CO'
            actividad.save()

        return instance
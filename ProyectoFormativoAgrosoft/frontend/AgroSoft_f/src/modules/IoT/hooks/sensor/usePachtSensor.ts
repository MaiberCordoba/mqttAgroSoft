import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patch } from "../../api/sensor";
import { SensorData } from "../../types/sensorTypes";
import { addToast } from "@heroui/toast";

export const usePatchSensor = () => {
  const queryClient = useQueryClient();

  return useMutation<SensorData, Error, { id: number; data: Partial<SensorData> }>({
    mutationFn: ({ id, data }) => {
      console.log("Enviando datos para editar sensor:", id, data);
      return patch(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sensor'] });

      addToast({
        title: "Actualización exitosa",
        description: "El sensor se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al actualizar sensor:", error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el sensor",
        color: "danger",
      });
    }
  });
};
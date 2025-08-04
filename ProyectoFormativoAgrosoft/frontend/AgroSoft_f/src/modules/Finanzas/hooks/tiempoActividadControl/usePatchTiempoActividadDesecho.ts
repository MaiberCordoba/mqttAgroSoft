import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTiempoActividadControl } from '../../api/tiempoActividadControlApi';
import { TiempoActividadControl } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchTiempoActividadControl = () => {
  const queryClient = useQueryClient();

  return useMutation<TiempoActividadControl, Error, { id: number; data: Partial<TiempoActividadControl> }>({
    mutationFn: ({ id, data }) => patchTiempoActividadControl(id, data),
    onSuccess: (updatedTiempoActividadControl, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TiempoActividadControl[]>(['TiempoActividadControl'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tiempoActividad) =>
          tiempoActividad.id === variables.id ? { ...tiempoActividad, ...updatedTiempoActividadControl } : tiempoActividad
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El tiempo de la actividad se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tiempo de la actividad control",
        color: "danger",
       
      });
    }
  });
};
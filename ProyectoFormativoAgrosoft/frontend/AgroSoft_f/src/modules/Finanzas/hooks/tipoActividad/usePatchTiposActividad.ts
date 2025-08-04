import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTipoActividad } from '../../api/tipoActividadApi';
import { TipoActividad } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchTipoActividades = () => {
  const queryClient = useQueryClient();

  return useMutation<TipoActividad, Error, { id: number; data: Partial<TipoActividad> }>({
    mutationFn: ({ id, data }) => patchTipoActividad(id, data),
    onSuccess: (updatedTipoActividades, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TipoActividad[]>(['tipoActividad'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tipoActividad) =>
          tipoActividad.id === variables.id ? { ...tipoActividad, ...updatedTipoActividades } : tipoActividad
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El tipo Actividad se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipo Actividad",
        color: "danger",
       
      });
    }
  });
};
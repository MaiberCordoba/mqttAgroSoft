import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchActividades } from '../../api/actividadesApi';
import { Actividades } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchActividades = () => {
  const queryClient = useQueryClient();

  return useMutation<Actividades, Error, { id: number; data: Partial<Actividades> }>({
    mutationFn: ({ id, data }) => patchActividades(id, data),
    onSuccess: (updatedActividad, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Actividades[]>(['actividades'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((actividad) =>
          actividad.id === variables.id ? { ...actividad, ...updatedActividad } : actividad
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La actividad se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la actividad",
        color: "danger",
       
      });
    }
  });
};
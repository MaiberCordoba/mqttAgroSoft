import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPlantaciones } from '../../api/plantacionesApi';
import { Plantaciones } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchPlantaciones = () => {
  const queryClient = useQueryClient();

  return useMutation<Plantaciones, Error, { id: number; data: Partial<Plantaciones> }>({
    mutationFn: ({ id, data }) => patchPlantaciones(id, data),
    onSuccess: (updatedPlantaciones, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Plantaciones[]>(['Plantaciones'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Plantaciones) =>
            Plantaciones.id === variables.id ? { ...Plantaciones, ...updatedPlantaciones } : Plantaciones
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "la plantacion se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la plantacion",
        color: "danger",
       
      });
    }
  });
};
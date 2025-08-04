import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEras } from '../../api/erasApi';
import { Eras } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchEras = () => {
  const queryClient = useQueryClient();

  return useMutation<Eras, Error, { id: number; data: Partial<Eras> }>({
    mutationFn: ({ id, data }) => patchEras(id, data),
    onSuccess: (updatedEras, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Eras[]>(['Eras'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Eras) =>
            Eras.id === variables.id ? { ...Eras, ...updatedEras } : Eras
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "la era se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la era",
        color: "danger",
       
      });
    }
  });
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchLotes } from '../../api/lotesApi';
import { Lotes } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchLotes = () => {
  const queryClient = useQueryClient();

  return useMutation<Lotes, Error, { id: number; data: Partial<Lotes> }>({
    mutationFn: ({ id, data }) => patchLotes(id, data),
    onSuccess: (updatedLotes, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Lotes[]>(['Lotes'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Lotes) =>
            Lotes.id === variables.id ? { ...Lotes, ...updatedLotes } : Lotes
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "el lote se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el lote",
        color: "danger",
       
      });
    }
  });
};
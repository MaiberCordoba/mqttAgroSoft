import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchSemilleros } from '../../api/semillerosApi';
import { Semillero } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchSemilleros = () => {
  const queryClient = useQueryClient();

  return useMutation<Semillero, Error, { id: number; data: Partial<Semillero> }>({
    mutationFn: ({ id, data }) => patchSemilleros(id, data),
    onSuccess: (updatedSemilleros, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Semillero[]>(['Semilleros'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Semilleros) =>
            Semilleros.id === variables.id ? { ...Semilleros, ...updatedSemilleros } : Semilleros
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "el semillero se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el semillero",
        color: "danger",
       
      });
    }
  });
};
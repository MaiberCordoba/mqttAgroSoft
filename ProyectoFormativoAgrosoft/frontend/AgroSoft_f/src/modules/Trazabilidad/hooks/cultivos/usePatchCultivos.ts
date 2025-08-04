import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchCultivos } from '../../api/cultivosApi';
import { Cultivo } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchCultivos = () => {
  const queryClient = useQueryClient();

  return useMutation<Cultivo, Error, { id: number; data: Partial<Cultivo> }>({
    mutationFn: ({ id, data }) => patchCultivos(id, data),
    onSuccess: (updatedCultivos, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Cultivo[]>(['cultivos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((Cultivos) =>
            Cultivos.id === variables.id ? { ...Cultivos, ...updatedCultivos } : Cultivos
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El cultivo se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el cultivo",
        color: "danger",
       
      });
    }
  });
};
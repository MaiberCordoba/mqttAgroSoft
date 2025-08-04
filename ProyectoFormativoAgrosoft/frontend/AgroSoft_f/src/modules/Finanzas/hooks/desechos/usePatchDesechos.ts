import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchDesechos } from '../../api/desechosApi';
import { Desechos } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchDesechos = () => {
  const queryClient = useQueryClient();

  return useMutation<Desechos, Error, { id: number; data: Partial<Desechos> }>({
    mutationFn: ({ id, data }) => patchDesechos(id, data),
    onSuccess: (updatedDesecho, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Desechos[]>(['desechos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((desecho) =>
          desecho.id === variables.id ? { ...desecho, ...updatedDesecho } : desecho
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El desecho se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el desecho",
        color: "danger",
       
      });
    }
  });
};

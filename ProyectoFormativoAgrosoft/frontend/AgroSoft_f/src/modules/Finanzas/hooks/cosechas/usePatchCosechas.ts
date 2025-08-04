import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchCosechas } from '../../api/cosechasApi';
import { Cosechas } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchCosechas = () => {
  const queryClient = useQueryClient();

  return useMutation<Cosechas, Error, { id: number; data: Partial<Cosechas> }>({
    mutationFn: ({ id, data }) => patchCosechas(id, data),
    onSuccess: (updatedCosecha, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Cosechas[]>(['cosechas'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((cosecha) =>
          cosecha.id === variables.id ? { ...cosecha, ...updatedCosecha } : cosecha
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La cosecha se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la cosecha",
        color: "danger",
       
      });
    }
  });
};

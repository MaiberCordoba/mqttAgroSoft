import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTiposDesechos } from '../../api/tiposDesechosApi';
import { TiposDesechos } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchTiposDesechos = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposDesechos, Error, { id: number; data: Partial<TiposDesechos> }>({
    mutationFn: ({ id, data }) => patchTiposDesechos(id, data),
    onSuccess: (updatedTiposDesechos, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TiposDesechos[]>(['tiposDesechos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tipoDesecho) =>
          tipoDesecho.id === variables.id ? { ...tipoDesecho, ...updatedTiposDesechos } : tipoDesecho
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El tipo Desecho se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipo Desecho",
        color: "danger",
       
      });
    }
  });
};
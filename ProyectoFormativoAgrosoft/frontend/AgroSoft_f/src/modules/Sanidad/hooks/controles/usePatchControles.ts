import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchControles } from '../../api/controles';
import { Controles } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchControles = () => {
  const queryClient = useQueryClient();

  return useMutation<Controles, Error, { id: number; data: Partial<Controles> }>({
    mutationFn: ({ id, data }) => patchControles(id, data),
    onSuccess: (updatedControl, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Controles[]>(['controles'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((control) =>
          control.id === variables.id ? { ...control, ...updatedControl } : control
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El control se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el control",
        color: "danger",
      });
    }
  });
};

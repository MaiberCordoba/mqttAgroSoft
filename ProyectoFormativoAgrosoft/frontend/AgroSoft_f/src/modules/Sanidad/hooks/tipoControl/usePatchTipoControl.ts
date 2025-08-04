import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTipoControl } from '../../api/tipoControl';
import { TipoControl } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchTipoControl = () => {
  const queryClient = useQueryClient();

  return useMutation<TipoControl, Error, { id: number; data: Partial<TipoControl> }>({
    mutationFn: ({ id, data }) => patchTipoControl(id, data),
    onSuccess: (updatedTipoControl, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TipoControl[]>(['TipoControl'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tipoControl) =>
          tipoControl.id === variables.id ? { ...tipoControl, ...updatedTipoControl } : tipoControl
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El tipo de control se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipo de control",
        color: "danger",
      });
    }
  });
};

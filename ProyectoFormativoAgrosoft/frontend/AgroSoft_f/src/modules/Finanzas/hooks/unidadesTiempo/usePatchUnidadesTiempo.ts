import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUnidadesTiempo } from '../../api/unidadesTiempoApi';
import { UnidadesTiempo } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchUnidadesTiempo = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesTiempo, Error, { id: number; data: Partial<UnidadesTiempo> }>({
    mutationFn: ({ id, data }) => patchUnidadesTiempo(id, data),
    onSuccess: (updatedUnidadTiempo, variables) => {
      queryClient.setQueryData<UnidadesTiempo[]>(['unidadesTiempo'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((unidadTiempo) =>
          unidadTiempo.id === variables.id ? { ...unidadTiempo, ...updatedUnidadTiempo } : unidadTiempo
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "La unidad de tiempo se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la unidad de tiempo",
        color: "danger",
      });
    }
  });
};

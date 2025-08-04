import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUnidadesMedida } from '../../api/unidadesMedidaApi';
import { UnidadesMedida } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchUnidadesMedida = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesMedida, Error, { id: number; data: Partial<UnidadesMedida> }>({
    mutationFn: ({ id, data }) => patchUnidadesMedida(id, data),
    onSuccess: (updatedUnidadMedida, variables) => {
      queryClient.setQueryData<UnidadesMedida[]>(['unidadesMedida'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((unidadMedida) =>
          unidadMedida.id === variables.id ? { ...unidadMedida, ...updatedUnidadMedida } : unidadMedida
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "La unidad de medida se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la unidad de medida",
        color: "danger",
      });
    }
  });
};

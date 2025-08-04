import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnidadesMedida } from "../../types";
import { deleteUnidadesMedida } from "../../api/unidadesMedidaApi";
import { addToast } from "@heroui/toast";

export const useDeleteUnidadesMedida = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesMedida, Error, { id: number }, { previousUnidadesMedida?: UnidadesMedida[] }>({
    mutationFn: ({ id }) => deleteUnidadesMedida(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['unidadesMedida'] });
      const previousUnidadesMedida = queryClient.getQueryData<UnidadesMedida[]>(['unidadesMedida']);
      queryClient.setQueryData<UnidadesMedida[]>(['unidadesMedida'], (old) =>
        old?.filter(unidad => unidad.id !== variables.id) || []
      );
      return { previousUnidadesMedida };
    },
    onError: (error, _variables, context) => {
      addToast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la unidad de Medida",
        color: "danger",
      });

      if (context?.previousUnidadesMedida) {
        console.error(error);
        queryClient.setQueryData(['unidadesMedida'], context.previousUnidadesMedida);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });

      addToast({
        title: "Operación exitosa",
        description: "La unidad de Medida fue eliminada correctamente",
        color: "success",
      });
    }
  });
};

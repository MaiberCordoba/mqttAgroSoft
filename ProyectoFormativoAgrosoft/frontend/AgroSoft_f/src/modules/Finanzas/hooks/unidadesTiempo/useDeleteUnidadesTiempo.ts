import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnidadesTiempo } from "../../types";
import { deleteUnidadesTiempo } from "../../api/unidadesTiempoApi";
import { addToast } from "@heroui/toast";

export const useDeleteUnidadesTiempo = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesTiempo, Error, { id: number }, { previousUnidadesTiempo?: UnidadesTiempo[] }>({
    mutationFn: ({ id }) => deleteUnidadesTiempo(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['unidadesTiempo'] });
      const previousUnidadesTiempo = queryClient.getQueryData<UnidadesTiempo[]>(['unidadesTiempo']);
      queryClient.setQueryData<UnidadesTiempo[]>(['unidadesTiempo'], (old) =>
        old?.filter(unidad => unidad.id !== variables.id) || []
      );
      return { previousUnidadesTiempo };
    },
    onError: (error, _variables, context) => {
      addToast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la unidad de tiempo",
        color: "danger",
      });

      if (context?.previousUnidadesTiempo) {
        console.error(error);
        queryClient.setQueryData(['unidadesTiempo'], context.previousUnidadesTiempo);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidadesTiempo'] });

      addToast({
        title: "Operación exitosa",
        description: "La unidad de tiempo fue eliminada correctamente",
        color: "success",
      });
    }
  });
};

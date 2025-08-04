import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Especies } from "../../types";
import { deleteEspecies } from "../../api/especiesApi";
import { addToast } from "@heroui/toast";

export const useDeleteEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, { id: number }, { previousEspecies?: Especies[] }>({
    mutationFn: ({ id }) => deleteEspecies(id),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['especies'] });

      const previousEspecies = queryClient.getQueryData<Especies[]>(['especies']);

      queryClient.setQueryData<Especies[]>(['especies'], (old) =>
        old?.filter((especie) => especie.id !== variables.id) || []
      );

      return { previousEspecies };
    },

    onError: (error, _variables, context) => {
      if (context?.previousEspecies) {
        queryClient.setQueryData(['especies'], context.previousEspecies);
      }

      console.error("Error al eliminar especie:", error);

      addToast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la especie",
        color: "danger",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especies'] });

      addToast({
        title: "Eliminación exitosa",
        description: "La especie fue eliminada correctamente",
        color: "success",
      });
    },
  });
};

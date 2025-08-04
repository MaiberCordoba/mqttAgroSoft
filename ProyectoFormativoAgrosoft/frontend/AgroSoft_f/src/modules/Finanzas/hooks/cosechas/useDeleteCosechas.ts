import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cosechas } from "../../types";
import { deleteCosechas } from "../../api/cosechasApi";
import { addToast } from "@heroui/toast";

export const useDeleteCosecha = () => {
    const queryClient = useQueryClient();

    return useMutation<Cosechas, Error, { id: number }, { previousCosechas?: Cosechas[] }>({
        mutationFn: ({ id }) => deleteCosechas(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['cosechas'] });
            const previousCosechas = queryClient.getQueryData<Cosechas[]>(['cosechas']);
            queryClient.setQueryData<Cosechas[]>(['cosechas'], (old) => 
                old?.filter(cosecha => cosecha.id !== variables.id) || []
            );
            return { previousCosechas };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la cosecha",
                color: "danger",
            });
            
            if (context?.previousCosechas) {
                console.error(error)
                queryClient.setQueryData(['cosechas'], context.previousCosechas);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cosechas'] });
            
            addToast({
                title: "Operación exitosa",
                description: "La cosecha fue eliminada correctamente",
                color: "success",
            });
        }
    });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Desechos } from "../../types";
import { deleteDesechos } from "../../api/desechosApi";
import { addToast } from "@heroui/toast";

export const useDeleteDesecho = () => {
    const queryClient = useQueryClient();

    return useMutation<Desechos, Error, { id: number }, { previousDesechos?: Desechos[] }>({
        mutationFn: ({ id }) => deleteDesechos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['desechos'] });
            const previousDesechos = queryClient.getQueryData<Desechos[]>(['desechos']);
            queryClient.setQueryData<Desechos[]>(['desechos'], (old) => 
                old?.filter(desecho => desecho.id !== variables.id) || []
            );
            return { previousDesechos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el desecho",
                color: "danger",
            });
            
            if (context?.previousDesechos) {
                console.error(error)
                queryClient.setQueryData(['desechos'], context.previousDesechos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['desechos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El desecho fue eliminado correctamente",
                color: "success",
            });
        }
    });
};

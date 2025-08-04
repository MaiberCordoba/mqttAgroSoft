import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controles } from "../../types";
import { deleteControles } from "../../api/controles";
import { addToast } from "@heroui/react";

export const useDeleteControl = () => {
    const queryClient = useQueryClient();

    return useMutation<Controles, Error, { id: number }, { previousControles?: Controles[] }>({
        mutationFn: ({ id }) => deleteControles(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['controles'] });

            const previousControles = queryClient.getQueryData<Controles[]>(['controles']);
            queryClient.setQueryData<Controles[]>(['controles'], (old) => 
                old?.filter(control => control.id !== variables.id) || []
            );

            return { previousControles };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el control",
                color: "danger",
            });
            
            if (context?.previousControles) {
                console.error(error);
                queryClient.setQueryData(['controles'], context.previousControles);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['controles'] });

            addToast({
                title: "Operación exitosa",
                description: "El control fue eliminado correctamente",
                color: "success",
            });
        }
    });
};

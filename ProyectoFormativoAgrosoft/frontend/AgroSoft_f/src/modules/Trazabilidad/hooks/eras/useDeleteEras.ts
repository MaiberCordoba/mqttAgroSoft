import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eras } from "../../types";
import { deleteEras } from "../../api/erasApi";
import { addToast } from "@heroui/react";

export const useDeleteEras = () => {
    const queryClient = useQueryClient();

    return useMutation<Eras, Error, { id: number }, { previousEras?: Eras[] }>({
        mutationFn: ({ id }) => deleteEras(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Eras'] });
            const previousEras = queryClient.getQueryData<Eras[]>(['Eras']);
            queryClient.setQueryData<Eras[]>(['Eras'], (old) => 
                old?.filter(Eras => Eras.id !== variables.id) || []
            );
            return { previousEras };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la era",
                color: "danger",
            });
            
            if (context?.previousEras) {
                console.error(error)
                queryClient.setQueryData(['Eras'], context.previousEras);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Eras'] });
            
            addToast({
                title: "Operación exitosa",
                description: "la era fue eliminada correctamente",
                color: "success",
            });
        }
    });
};
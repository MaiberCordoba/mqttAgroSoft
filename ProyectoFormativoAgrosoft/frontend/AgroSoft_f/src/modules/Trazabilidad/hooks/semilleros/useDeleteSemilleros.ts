import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Semilleros } from "../../types";
import { deleteSemilleros } from "../../api/semillerosApi";
import { addToast } from "@heroui/react";

export const useDeleteSemilleros = () => {
    const queryClient = useQueryClient();

    return useMutation<Semilleros, Error, { id: number }, { previousSemilleros?: Semilleros[] }>({
        mutationFn: ({ id }) => deleteSemilleros(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Semilleros'] });
            const previousSemilleros = queryClient.getQueryData<Semilleros[]>(['Semilleros']);
            queryClient.setQueryData<Semilleros[]>(['Semilleros'], (old) => 
                old?.filter(Semilleros => Semilleros.id !== variables.id) || []
            );
            return { previousSemilleros };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el semillero",
                color: "danger",
            });
            
            if (context?.previousSemilleros) {
                console.error(error)
                queryClient.setQueryData(['Semilleros'], context.previousSemilleros);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Semilleros'] });
            
            addToast({
                title: "Operación exitosa",
                description: "el semillero fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
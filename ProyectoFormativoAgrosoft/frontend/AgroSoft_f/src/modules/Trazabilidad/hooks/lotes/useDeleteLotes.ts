import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lotes } from "../../types";
import { deleteLotes } from "../../api/lotesApi";
import { addToast } from "@heroui/react";

export const useDeleteLotes = () => {
    const queryClient = useQueryClient();

    return useMutation<Lotes, Error, { id: number }, { previousLotes?: Lotes[] }>({
        mutationFn: ({ id }) => deleteLotes(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Lotes'] });
            const previousLotes = queryClient.getQueryData<Lotes[]>(['Lotes']);
            queryClient.setQueryData<Lotes[]>(['Lotes'], (old) => 
                old?.filter(Lotes => Lotes.id !== variables.id) || []
            );
            return { previousLotes };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el lote",
                color: "danger",
            });
            
            if (context?.previousLotes) {
                console.error(error)
                queryClient.setQueryData(['Lotes'], context.previousLotes);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Lotes'] });
            
            addToast({
                title: "Operación exitosa",
                description: "el lote fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
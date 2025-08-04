import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TiposDesechos } from "../../types";
import { deleteTiposDesechos } from "../../api/tiposDesechosApi";
import { addToast } from "@heroui/toast";

export const useDeleteTiposDesechos = () => {
    const queryClient = useQueryClient();

    return useMutation<TiposDesechos, Error, { id: number }, { previousTiposDesechos?: TiposDesechos[] }>({
        mutationFn: ({ id }) => deleteTiposDesechos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['tiposDesechos'] });
            const previousTiposDesechos = queryClient.getQueryData<TiposDesechos[]>(['tiposDesechos']);
            queryClient.setQueryData<TiposDesechos[]>(['tiposDesechos'], (old) => 
                old?.filter(tiposDesechos => tiposDesechos.id !== variables.id) || []
            );
            return { previousTiposDesechos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tipo de desecho",
                color: "danger",
            });
            
            if (context?.previousTiposDesechos) {
                console.error(error)
                queryClient.setQueryData(['tiposDesechos'], context.previousTiposDesechos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposDesechos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El tipo de desecho fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TiposEspecie } from "../../types";
import { deleteTiposEspecie } from "../../api/tiposEspecieApi";
import { addToast } from "@heroui/react";

export const useDeleteTiposEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation<TiposEspecie, Error, { id: number }, { previousTiposEspecie?: TiposEspecie[] }>({
        mutationFn: ({ id }) => deleteTiposEspecie(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['tiposEspecie'] });
            const previousTiposEspecie = queryClient.getQueryData<TiposEspecie[]>(['tiposEspecie']);
            queryClient.setQueryData<TiposEspecie[]>(['tiposEspecie'], (old) => 
                old?.filter(tiposEspecie => tiposEspecie.id !== variables.id) || []
            );
            return { previousTiposEspecie };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tipo de especie",
                color: "danger",
            });
            
            if (context?.previousTiposEspecie) {
                console.error(error)
                queryClient.setQueryData(['TiposEspecie'], context.previousTiposEspecie);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiposEspecie'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El tipo de especie fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TiposAfecciones } from "../../types";
import { deleteTipoAfecciones } from "../../api/tipoAfecciones";
import { addToast } from "@heroui/react";

export const useDeleteTipoAfeccion = () => {
    const queryClient = useQueryClient();

    return useMutation<TiposAfecciones, Error, { id: number }, { previousTipoAfecciones?: TiposAfecciones[] }>({
        mutationFn: ({ id }) => deleteTipoAfecciones(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['TiposAfecciones'] });
            const previousTipoAfecciones = queryClient.getQueryData<TiposAfecciones[]>(['TiposAfecciones']);
            queryClient.setQueryData<TiposAfecciones[]>(['TiposAfecciones'], (old) => 
                old?.filter(tiposafeccion => tiposafeccion.id !== variables.id) || []
            );
            return { previousTipoAfecciones };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tipo de afección",
                color: "danger",
            });
            
            if (context?.previousTipoAfecciones) {
                console.error(error)
                queryClient.setQueryData(['TiposAfecciones'], context.previousTipoAfecciones);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['TiposAfecciones'] });
            
            addToast({
                title: "Operación exitosa",
                description: "el tipo de afeccion fue eliminada correctamente",
                color: "success",
            });
        }
    });
};
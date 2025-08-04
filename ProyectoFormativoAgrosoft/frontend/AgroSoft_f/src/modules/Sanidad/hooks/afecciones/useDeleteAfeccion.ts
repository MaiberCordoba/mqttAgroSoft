import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Afecciones } from "../../types";
import { deleteAfecciones } from "../../api/afeccionesApi";
import { addToast } from "@heroui/react";

export const useDeleteAfeccion = () => {
    const queryClient = useQueryClient();

    return useMutation<Afecciones, Error, { id: number }, { previousAfecciones?: Afecciones[] }>({
        mutationFn: ({ id }) => deleteAfecciones(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['afecciones'] });
            const previousAfecciones = queryClient.getQueryData<Afecciones[]>(['afecciones']);
            queryClient.setQueryData<Afecciones[]>(['afecciones'], (old) => 
                old?.filter(afeccion => afeccion.id !== variables.id) || []
            );
            return { previousAfecciones };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la afección",
                color: "danger",
            });
            
            if (context?.previousAfecciones) {
                console.error(error)
                queryClient.setQueryData(['afecciones'], context.previousAfecciones);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['afecciones'] });
            
            addToast({
                title: "Operación exitosa",
                description: "La afección fue eliminada correctamente",
                color: "success",
            });
        }
    });
};
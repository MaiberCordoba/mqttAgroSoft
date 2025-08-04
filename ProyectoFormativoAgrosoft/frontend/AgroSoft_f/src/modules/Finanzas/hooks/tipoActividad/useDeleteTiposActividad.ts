import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TipoActividad } from "../../types";
import { deleteTipoActividad } from "../../api/tipoActividadApi";
import { addToast } from "@heroui/toast";

export const useDeleteTipoActividad = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoActividad, Error, { id: number }, { previousTipoActividad?: TipoActividad[] }>({
        mutationFn: ({ id }) => deleteTipoActividad(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['tipoActividad'] });
            const previousTipoActividad = queryClient.getQueryData<TipoActividad[]>(['tipoActividad']);
            queryClient.setQueryData<TipoActividad[]>(['tipoActividad'], (old) => 
                old?.filter(tipoActividad => tipoActividad.id !== variables.id) || []
            );
            return { previousTipoActividad };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tipo de actividad",
                color: "danger",
            });
            
            if (context?.previousTipoActividad) {
                console.error(error)
                queryClient.setQueryData(['tipoActividad'], context.previousTipoActividad);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tipoActividad'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El tipo de actividad fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
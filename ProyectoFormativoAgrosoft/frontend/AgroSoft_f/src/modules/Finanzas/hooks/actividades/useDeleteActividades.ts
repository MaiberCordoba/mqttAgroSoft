import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Actividades } from "../../types";
import { deleteActividades } from "../../api/actividadesApi";
import { addToast } from "@heroui/toast";

export const useDeleteActividades = () => {
    const queryClient = useQueryClient();

    return useMutation<Actividades, Error, { id: number }, { previousActividades?: Actividades[] }>({
        mutationFn: ({ id }) => deleteActividades(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['actividades'] });
            const previousActividades = queryClient.getQueryData<Actividades[]>(['actividades']);
            queryClient.setQueryData<Actividades[]>(['actividades'], (old) => 
                old?.filter(actividad => actividad.id !== variables.id) || []
            );
            return { previousActividades };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la actividad",
                color: "danger",
            });
            
            if (context?.previousActividades) {
                console.error(error)
                queryClient.setQueryData(['actividades'], context.previousActividades);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['actividades'] });
            
            addToast({
                title: "Operación exitosa",
                description: "La actividad fue eliminada correctamente",
                color: "success",
            });
        }
    });
};
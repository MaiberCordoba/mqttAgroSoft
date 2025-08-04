import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TiempoActividadControl } from "../../types";
import { deleteTiempoActividadControl } from "../../api/tiempoActividadControlApi";
import { addToast } from "@heroui/toast";

export const useDeleteTiempoActividadControl = () => {
    const queryClient = useQueryClient();

    return useMutation<TiempoActividadControl, Error, { id: number }, { previousTiempoActividadControl?: TiempoActividadControl[] }>({
        mutationFn: ({ id }) => deleteTiempoActividadControl(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['TiempoActividadControl'] });
            const previousTiempoActividadControl = queryClient.getQueryData<TiempoActividadControl[]>(['tiempoActividadControl']);
            queryClient.setQueryData<TiempoActividadControl[]>(['TiempoActividadControl'], (old) => 
                old?.filter(TiempoActividadControl => TiempoActividadControl.id !== variables.id) || []
            );
            return { previousTiempoActividadControl };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tiempo de actividad control",
                color: "danger",
            });
            
            if (context?.previousTiempoActividadControl) {
                console.error(error)
                queryClient.setQueryData(['tiempoActividadControl'], context.previousTiempoActividadControl);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiempoActividadControl'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El tiempo de actividad control fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
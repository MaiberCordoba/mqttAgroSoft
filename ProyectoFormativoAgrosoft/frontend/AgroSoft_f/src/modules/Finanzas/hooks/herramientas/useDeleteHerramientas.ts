import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Herramientas } from "../../types";
import { deleteHerramientas } from "../../api/herramientasApi";
import { addToast } from "@heroui/toast";

export const useDeleteHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation<Herramientas, Error, { id: number }, { previousHerramientas?: Herramientas[] }>({
        mutationFn: ({ id }) => deleteHerramientas(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['herramientas'] });
            const previousHerramientas = queryClient.getQueryData<Herramientas[]>(['herramientas']);
            queryClient.setQueryData<Herramientas[]>(['herramientas'], (old) => 
                old?.filter(herramienta => herramienta.id !== variables.id) || []
            );
            return { previousHerramientas };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la herramienta",
                color: "danger",
            });
            
            if (context?.previousHerramientas) {
                console.error(error)
                queryClient.setQueryData(['herramientas'], context.previousHerramientas);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herramientas'] });
            
            addToast({
                title: "Operación exitosa",
                description: "La herramienta fue eliminada correctamente",
                color: "success",
            });
        }
    });
};

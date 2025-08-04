import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsosHerramientas } from "../../types";
import { deleteUsosHerramientas } from "../../api/usosHerramientasApi";
import { addToast } from "@heroui/toast";

export const useDeleteUsoHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation<UsosHerramientas, Error, { id: number }, { previousUsoHerramientas?: UsosHerramientas[] }>({
        mutationFn: ({ id }) => deleteUsosHerramientas(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['usosHerramientas'] });
            const previousUsoHerramientas = queryClient.getQueryData<UsosHerramientas[]>(['usosHerramientas']);
            queryClient.setQueryData<UsosHerramientas[]>(['usosHerramientas'], (old) => 
                old?.filter(usoHerramienta => usoHerramienta.id !== variables.id) || []
            );
            return { previousUsoHerramientas };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el uso de herramienta",
                color: "danger",
            });
            
            if (context?.previousUsoHerramientas) {
                console.error(error)
                queryClient.setQueryData(['usoHerramientas'], context.previousUsoHerramientas);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usosHerramientas'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El uso de herramienta fue eliminada correctamente",
                color: "success",
            });
        }
    });
};

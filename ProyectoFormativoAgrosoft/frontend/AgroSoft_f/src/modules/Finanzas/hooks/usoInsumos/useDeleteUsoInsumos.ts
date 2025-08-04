import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsosInsumos } from "../../types";
import { deleteUsosInsumos } from "../../api/usoInsumosApi";
import { addToast } from "@heroui/toast";

export const useDeleteUsoInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation<UsosInsumos, Error, { id: number }, { previousUsoInsumos?: UsosInsumos[] }>({
        mutationFn: ({ id }) => deleteUsosInsumos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['usosInsumos'] });
            const previousUsoInsumos = queryClient.getQueryData<UsosInsumos[]>(['usosInsumos']);
            queryClient.setQueryData<UsosInsumos[]>(['usosInsumos'], (old) => 
                old?.filter(usoHerramienta => usoHerramienta.id !== variables.id) || []
            );
            return { previousUsoInsumos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el uso de insumo",
                color: "danger",
            });
            
            if (context?.previousUsoInsumos) {
                console.error(error)
                queryClient.setQueryData(['usoInsumos'], context.previousUsoInsumos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usoInsumos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El uso de insumo fue eliminado correctamente",
                color: "success",
            });
        }
    });
};

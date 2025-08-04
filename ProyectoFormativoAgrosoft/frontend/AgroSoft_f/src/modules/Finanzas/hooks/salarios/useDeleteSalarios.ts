import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Salarios } from "../../types";
import { deleteSalarios } from "../../api/salariosApi";
import { addToast } from "@heroui/toast";

export const useDeleteSalarios = () => {
    const queryClient = useQueryClient();

    return useMutation<Salarios, Error, { id: number }, { previousSalarios?: Salarios[] }>({
        mutationFn: ({ id }) => deleteSalarios(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Salarios'] });
            const previousSalarios = queryClient.getQueryData<Salarios[]>(['salarios']);
            queryClient.setQueryData<Salarios[]>(['salarios'], (old) => 
                old?.filter(insumo => insumo.id !== variables.id) || []
            );
            return { previousSalarios };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el salario",
                color: "danger",
            });
            
            if (context?.previousSalarios) {
                console.error(error)
                queryClient.setQueryData(['salarios'], context.previousSalarios);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salarios'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El salario fue eliminado correctamente",
                color: "success",
            });
        }
    });
};

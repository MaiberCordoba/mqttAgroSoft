import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cultivo } from "../../types";
import { deleteCultivos } from "../../api/cultivosApi";
import { addToast } from "@heroui/react";

export const useDeleteCultivos = () => {
    const queryClient = useQueryClient();

    return useMutation<Cultivo, Error, { id: number }, { previousCultivos?: Cultivo[] }>({
        mutationFn: ({ id }) => deleteCultivos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['cultivos'] });
            const previousCultivos = queryClient.getQueryData<Cultivo[]>(['cultivos']);
            queryClient.setQueryData<Cultivo[]>(['cultivos'], (old) => 
                old?.filter(Cultivos => Cultivos.id !== variables.id) || []
            );
            return { previousCultivos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el cultivo",
                color: "danger",
            });
            
            if (context?.previousCultivos) {
                console.error(error)
                queryClient.setQueryData(['cultivos'], context.previousCultivos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cultivos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El cultivo fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
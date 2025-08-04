import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plantaciones } from "../../types";
import { deletePlantaciones } from "../../api/plantacionesApi";
import { addToast } from "@heroui/react";

export const useDeletePlantaciones = () => {
    const queryClient = useQueryClient();

    return useMutation<Plantaciones, Error, { id: number }, { previousPlantaciones?: Plantaciones[] }>({
        mutationFn: ({ id }) => deletePlantaciones(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['Plantaciones'] });
            const previousPlantaciones = queryClient.getQueryData<Plantaciones[]>(['Plantaciones']);
            queryClient.setQueryData<Plantaciones[]>(['Plantaciones'], (old) => 
                old?.filter(Plantaciones => Plantaciones.id !== variables.id) || []
            );
            return { previousPlantaciones };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la plantacion",
                color: "danger",
            });
            
            if (context?.previousPlantaciones) {
                console.error(error)
                queryClient.setQueryData(['Plantaciones'], context.previousPlantaciones);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Plantaciones'] });
            
            addToast({
                title: "Operación exitosa",
                description: "la plantacion fue eliminada correctamente",
                color: "success",
            });
        }
    });
};
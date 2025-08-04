import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AfeccionesCultivo } from "../../types";
import { deleteAfeccionesCultivo } from "../../api/afeccionescultivo";
import { addToast } from "@heroui/react";

export const useDeleteAfeccionCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation<AfeccionesCultivo, Error, { id: number }, { previousAfecciones?: AfeccionesCultivo[] }>({
        mutationFn: ({ id }) => deleteAfeccionesCultivo(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['afeccionesCultivo'] });

            const previousAfecciones = queryClient.getQueryData<AfeccionesCultivo[]>(['afeccionesCultivo']);

            queryClient.setQueryData<AfeccionesCultivo[]>(['afeccionesCultivo'], (old) =>
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
                console.error(error);
                queryClient.setQueryData(['afeccionesCultivo'], context.previousAfecciones);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['afeccionesCultivo'] });

            addToast({
                title: "Operación exitosa",
                description: "La afección fue eliminada correctamente",
                color: "success",
            });
        }
    });
};

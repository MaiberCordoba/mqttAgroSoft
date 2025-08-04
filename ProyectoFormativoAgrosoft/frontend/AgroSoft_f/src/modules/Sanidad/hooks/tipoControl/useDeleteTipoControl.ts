import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TipoControl } from "../../types";
import { deleteTipoControl } from "../../api/tipoControl";
import { addToast } from "@heroui/react";

export const useDeleteTipoControl = () => {
    const queryClient = useQueryClient();

    return useMutation<TipoControl, Error, { id: number }, { previousTipoControl?: TipoControl[] }>({
        mutationFn: ({ id }) => deleteTipoControl(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["TipoControl"] });
            const previousTipoControl = queryClient.getQueryData<TipoControl[]>(["TipoControl"]);
            queryClient.setQueryData<TipoControl[]>(["TipoControl"], (old) =>
                old?.filter((tipoControl) => tipoControl.id !== variables.id) || []
            );
            return { previousTipoControl };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el tipo de control",
                color: "danger",
            });

            if (context?.previousTipoControl) {
                console.error(error);
                queryClient.setQueryData(["TipoControl"], context.previousTipoControl);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["TipoControl"] });

            addToast({
                title: "Operación exitosa",
                description: "El tipo de control fue eliminado correctamente",
                color: "success",
            });
        },
    });
};

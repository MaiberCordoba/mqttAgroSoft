import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ventas } from "../../types";
import { deleteVentas } from "../../api/ventasApi";
import { addToast } from "@heroui/toast";

export const useDeleteVenta = () => {
    const queryClient = useQueryClient();

    return useMutation<Ventas, Error, { id: number }, { previousVentas?: Ventas[] }>({
        mutationFn: ({ id }) => deleteVentas(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['ventas'] });
            const previousVentas = queryClient.getQueryData<Ventas[]>(['ventas']);
            queryClient.setQueryData<Ventas[]>(['ventas'], (old) => 
                old?.filter(venta => venta.id !== variables.id) || []
            );
            return { previousVentas };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la venta",
                color: "danger",
            });
            
            if (context?.previousVentas) {
                console.error(error)
                queryClient.setQueryData(['ventas'], context.previousVentas);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventas'] });
            
            addToast({
                title: "Operación exitosa",
                description: "La venta fue eliminada correctamente",
                color: "success",
            });
        }
    });
};

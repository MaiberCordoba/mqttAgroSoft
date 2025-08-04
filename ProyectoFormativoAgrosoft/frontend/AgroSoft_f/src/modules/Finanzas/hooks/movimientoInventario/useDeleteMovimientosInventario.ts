import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MovimientoInventario } from "../../types";
import { deleteMovimientoInventario } from "../../api/movimientoInventarioApi";
import { addToast } from "@heroui/toast";

export const useDeleteMovimientoInventario = () => {
    const queryClient = useQueryClient();

    return useMutation<MovimientoInventario, Error, { id: number }, { previousMovimientoInventario?: MovimientoInventario[] }>({
        mutationFn: ({ id }) => deleteMovimientoInventario(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['movimientos'] });
            const previousMovimientoInventario = queryClient.getQueryData<MovimientoInventario[]>(['movimientos']);
            queryClient.setQueryData<MovimientoInventario[]>(['movimientos'], (old) => 
                old?.filter(movimiento => movimiento.id !== variables.id) || []
            );
            return { previousMovimientoInventario };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el movimiento de inventario",
                color: "danger",
            });
            
            if (context?.previousMovimientoInventario) {
                console.error(error)
                queryClient.setQueryData(['movimientos'], context.previousMovimientoInventario);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movimientos'] });
            
            addToast({
                title: "Operación exitosa",
                description: "El movimiento de inventario fue eliminado correctamente",
                color: "success",
            });
        }
    });
};

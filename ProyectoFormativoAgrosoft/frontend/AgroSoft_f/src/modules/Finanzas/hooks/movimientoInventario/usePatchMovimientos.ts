import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMovimientoInventario } from '../../api/movimientoInventarioApi';
import { MovimientoInventario } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchMovimientoInventario = () => {
  const queryClient = useQueryClient();

  return useMutation<MovimientoInventario, Error,{ id: number; data:Partial<MovimientoInventario>}>({
    mutationFn: ({ id, data }) => patchMovimientoInventario(id, data),
    onSuccess: (updatedMovimientoInventario, variables) => {
      queryClient.setQueryData<MovimientoInventario[]>(['movimientos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((movimiento) =>
          movimiento.id === variables.id ? { ...movimiento, ...updatedMovimientoInventario} : movimiento
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El movimiento se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el movimiento",
        color: "danger",
       
      });
    }
  });
};

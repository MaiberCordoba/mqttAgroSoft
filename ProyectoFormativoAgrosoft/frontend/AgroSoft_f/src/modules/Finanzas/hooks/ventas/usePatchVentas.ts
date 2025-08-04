import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchVentas } from '../../api/ventasApi';
import { Ventas } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchVentas = () => {
  const queryClient = useQueryClient();

  return useMutation<Ventas, Error, { id: number; data: Partial<Ventas> }>({
    mutationFn: ({ id, data }) => patchVentas(id, data),
    onSuccess: (updatedVenta, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Ventas[]>(['ventas'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((venta) =>
          venta.id === variables.id ? { ...venta, ...updatedVenta } : venta
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La venta se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la venta",
        color: "danger",
       
      });
    }
  });
};

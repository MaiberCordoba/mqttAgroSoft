import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVentas } from "../../api/ventasApi";
import { Ventas } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostVentas = () => {
  const queryClient = useQueryClient();

  return useMutation<Ventas, Error, Ventas>({
    mutationKey: ['crearVenta'],
    mutationFn: postVentas,
    onSuccess: (data) => {
      console.log("Venta creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['ventas'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva venta registrada con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la venta:", error);
      addToast({
        title: 'Error al crear la venta',
        description: 'No fue posible registrar nueva venta',
        color: 'danger'
      })
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMovimientoInventario } from "../../api/movimientoInventarioApi";
import { MovimientoInventario } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostMovimiento = () => {
  const queryClient = useQueryClient();

  return useMutation<MovimientoInventario, Error,MovimientoInventario>({
    mutationKey: ['crearMovimiento'],
    mutationFn: postMovimientoInventario,
    onSuccess: (data) => {
      console.log("Movimiento creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo movimiento registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el movimiento:", error);
      addToast({
        title: 'Error al crear el insumo',
        description: 'No fue posible registrar un nuevo movimiento',
        color: 'danger'
      })
    },
  });
};

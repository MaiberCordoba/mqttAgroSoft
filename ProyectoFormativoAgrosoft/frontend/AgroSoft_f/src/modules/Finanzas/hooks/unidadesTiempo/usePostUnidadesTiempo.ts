import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUnidadesTiempo } from "../../api/unidadesTiempoApi";
import { UnidadesTiempo } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostUnidadesTiempo = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesTiempo, Error, UnidadesTiempo>({
    mutationKey: ['crearUnidadTiempo'],
    mutationFn: postUnidadesTiempo,
    onSuccess: (data) => {
      console.log("Unidad de tiempo creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['unidadesTiempo'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Unidad de tiempo registrada con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear la unidad de tiempo:", error);
      addToast({
        title: 'Error al crear la unidad de tiempo',
        description: 'No fue posible registrar una unidad de tiempo',
        color: 'danger'
      });
    },
  });
};

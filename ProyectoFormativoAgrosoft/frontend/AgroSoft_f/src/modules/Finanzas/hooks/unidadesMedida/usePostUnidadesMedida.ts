import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUnidadMedida } from "../../api/unidadesMedidaApi";
import { UnidadesMedida } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostUnidadesMedida = () => {
  const queryClient = useQueryClient();

  return useMutation<UnidadesMedida, Error, UnidadesMedida>({
    mutationKey: ['crearUnidadMedida'],
    mutationFn: postUnidadMedida,
    onSuccess: (data) => {
      console.log("Unidad de medida creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['unidadesMedida'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Unidad de medida registrada con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear la unidad de medida:", error);
      addToast({
        title: 'Error al crear la unidad de medida',
        description: 'No fue posible registrar una unidad de medida',
        color: 'danger'
      });
    },
  });
};

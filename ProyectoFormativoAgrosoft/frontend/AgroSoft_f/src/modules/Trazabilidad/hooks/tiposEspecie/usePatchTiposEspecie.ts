import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTiposEspecie } from "../../api/tiposEspecieApi";
import { TiposEspecie } from "../../types";
import { addToast } from "@heroui/toast";

export const usePatchTiposEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposEspecie, Error, { id: number; data: FormData }>({
    mutationKey: ['actualizarTiposEspecie'],
    mutationFn: async ({ id, data }) => patchTiposEspecie(id, data),
    onSuccess: (data) => {
      console.log("Tipo de especie actualizada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['tiposEspecie'] });

      addToast({
        title: 'Actualización exitosa',
        description: 'Tipo de especie actualizado con éxito',
        color: 'success',
      });
    },
    onError: (error) => {
      console.error("Error al actualizar el tipo de especie:", error);
      addToast({
        title: 'Error al actualizar tipo de especie',
        description: 'No fue posible actualizar el tipo de especie',
        color: 'danger',
      });
    },
  });
};
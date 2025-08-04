import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoControl } from "../../api/tipoControl";
import { TipoControl } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTipoControl = () => {
  const queryClient = useQueryClient();

  return useMutation<TipoControl, Error, TipoControl>({
    mutationKey: ['TipoControl'],
    mutationFn: postTipoControl,
    onSuccess: (data) => {
      console.log("Tipo de control fue creado con éxito:", data);

      // Invalida la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['TipoControl'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo tipo de control registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el tipo de control:", error);
      addToast({
        title: 'Error al crear el tipo de control',
        description: 'No fue posible registrar un nuevo tipo de control',
        color: 'danger'
      });
    },
  });
};

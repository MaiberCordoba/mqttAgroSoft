import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTiposDesechos } from "../../api/tiposDesechosApi";
import { TiposDesechos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTiposDesechos = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposDesechos, Error, TiposDesechos>({
    mutationKey: ['crearTipoDesechos'],
    mutationFn: postTiposDesechos,
    onSuccess: (data) => {
      console.log("Tipo de desecho creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['tiposDesechos'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Tipo de desecho registrado con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el tipo de desecho:", error);
      addToast({
        title: 'Error al crear el tipo de desecho',
        description: 'No fue posible  registrar un tipo de desecho',
        color: 'danger'
      })
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDesecho } from "../../api/desechosApi";
import { Desechos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostDesecho = () => {
  const queryClient = useQueryClient();

  return useMutation<Desechos, Error, Desechos>({
    mutationKey: ['crearDesecho'],
    mutationFn: postDesecho,
    onSuccess: (data) => {
      console.log("Desecho creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['desechos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo desecho registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el desecho:", error);
      addToast({
        title: 'Error al crear el desecho',
        description: 'No fue posible registrar nuevo desecho',
        color: 'danger'
      })
    },
  });
};

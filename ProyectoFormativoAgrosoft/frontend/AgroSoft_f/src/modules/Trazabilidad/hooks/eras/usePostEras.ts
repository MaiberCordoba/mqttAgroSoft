import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEras } from "../../api/erasApi";
import { Eras } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostEras = () => {
  const queryClient = useQueryClient();

  return useMutation<Eras, Error, Eras>({
    mutationKey: ['crearEras'],
    mutationFn: postEras,
    onSuccess: (data) => {
      console.log("era creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Eras'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Eras registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la era:", error);
      addToast({
        title: 'Error al crear la Eras',
        description: 'No fue posible  registrar nueva Eras',
        color: 'success'
      })
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAfecciones } from "../../api/afeccionesApi";
import { Afecciones } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostAfeccion = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FormData, Afecciones>({
    mutationKey: ['crearAfeccion'],
    mutationFn: postAfecciones,
    onSuccess: (data) => {
      console.log("Afección creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['afecciones'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva afeccion registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la afección:", error);
      addToast({
        title: 'Error al crear la afeccion',
        description: 'No fue posible  registrar nueva afeccion',
        color: 'success'
      })
    },
  });
};
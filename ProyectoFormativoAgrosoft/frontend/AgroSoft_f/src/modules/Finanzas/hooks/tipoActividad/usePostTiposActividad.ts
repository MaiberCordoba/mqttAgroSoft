import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoActividad } from "../../api/tipoActividadApi";
import { TipoActividad } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTipoActividad = () => {
  const queryClient = useQueryClient();

  return useMutation<TipoActividad, Error, TipoActividad>({
    mutationKey: ['crearTipoActividad'],
    mutationFn: postTipoActividad,
    onSuccess: (data) => {
      console.log("Tipo de actividad creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['tipoActividad'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Tipo de actividad registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el tipo de actividad:", error);
      addToast({
        title: 'Error al crear el tipo de actividad',
        description: 'No fue posible  registrar un tipo de actividad',
        color: 'danger'
      })
    },
  });
};
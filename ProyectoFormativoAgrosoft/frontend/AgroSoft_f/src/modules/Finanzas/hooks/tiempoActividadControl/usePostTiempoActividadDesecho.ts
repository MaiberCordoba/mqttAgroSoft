import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTiempoActividadControl } from "../../api/tiempoActividadControlApi";
import { TiempoActividadControl } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTiempoActividadControl = () => {
  const queryClient = useQueryClient();

  return useMutation<TiempoActividadControl, Error, TiempoActividadControl>({
    mutationKey: ['crearTiempoActividadControl'],
    mutationFn: postTiempoActividadControl,
    onSuccess: (data) => {
      console.log("tiempo de actividad control creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['TiempoActividadControl'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Tiempo de actividad registrado con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el tiempo de actividad:", error);
      addToast({
        title: 'Error al crear el tiempo de actividad',
        description: 'No fue posible  registrar un tiempo de actividad',
        color: 'danger'
      })
    },
  });
};
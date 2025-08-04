import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postActividad } from "../../api/actividadesApi";
import { Actividades } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostActividades = () => {
  const queryClient = useQueryClient();

  return useMutation<Actividades, Error, Actividades>({
    mutationKey: ['crearActividad'],
    mutationFn: postActividad,
    onSuccess: (data) => {
      console.log("Actividad creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['actividades'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Actividad registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la actividad:", error);
      addToast({
        title: 'Error al crear la actividad',
        description: 'No fue posible  registrar nueva actividad',
        color: 'danger'
      })
    },
  });
};
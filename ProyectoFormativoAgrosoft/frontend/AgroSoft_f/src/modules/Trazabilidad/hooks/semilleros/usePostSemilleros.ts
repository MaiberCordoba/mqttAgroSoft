import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSemilleros } from "../../api/semillerosApi";
import { Semillero } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostSemilleros = () => {
  const queryClient = useQueryClient();

  return useMutation<Semillero, Error, Semillero>({
    mutationKey: ['crearSemilleros'],
    mutationFn: postSemilleros,
    onSuccess: (data) => {
      console.log("semillero creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Semilleros'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo semillero registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el semillero:", error);
      addToast({
        title: 'Error al crear el semillero',
        description: 'No fue posible registrar el nuevo semillero',
        color: 'danger'
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCosecha } from "../../api/cosechasApi";
import { Cosechas } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostCosecha = () => {
  const queryClient = useQueryClient();

  return useMutation<Cosechas, Error, Cosechas>({
    mutationKey: ['crearCosecha'],
    mutationFn: postCosecha,
    onSuccess: (data) => {
      console.log("Cosecha creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['cosechas'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva cosecha registrada con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la cosecha:", error);
      addToast({
        title: 'Error al crear la cosecha',
        description: 'No fue posible registrar nueva cosecha',
        color: 'danger'
      })
    },
  });
};

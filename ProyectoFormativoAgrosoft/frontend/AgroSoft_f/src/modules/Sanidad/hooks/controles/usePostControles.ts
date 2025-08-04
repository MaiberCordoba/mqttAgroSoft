import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postcontroles } from "../../api/controles";
import { Controles } from "../../types";
import { addToast } from "@heroui/toast";

export const postControles = () => {
  const queryClient = useQueryClient();

  return useMutation<Controles, Error, Controles>({
    mutationKey: ['crearControl'],
    mutationFn:  postcontroles,
    onSuccess: (data) => {
      console.log("Control creado con éxito:", data);

      // Invalida la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['controles'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo control registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el control:", error);
      addToast({
        title: 'Error al crear el control',
        description: 'No fue posible registrar el nuevo control',
        color: 'danger'
      });
    },
  });
};

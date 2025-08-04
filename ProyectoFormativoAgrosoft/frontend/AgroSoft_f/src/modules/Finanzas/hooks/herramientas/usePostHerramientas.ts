import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHerramienta } from "../../api/herramientasApi";
import { Herramientas } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostHerramienta = () => {
  const queryClient = useQueryClient();

  return useMutation<Herramientas, Error, Herramientas>({
    mutationKey: ['crearHerramienta'],
    mutationFn: postHerramienta,
    onSuccess: (data) => {
      console.log("Herramienta creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['herramientas'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva herramienta registrada con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear la herramienta:", error);
      addToast({
        title: 'Error al crear la herramienta',
        description: 'No fue posible registrar nueva herramienta',
        color: 'danger'
      })
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUsoHerramienta } from "../../api/usosHerramientasApi";
import { UsosHerramientas } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostUsoHerramienta = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosHerramientas, Error, UsosHerramientas>({
    mutationKey: ['crearUsoHerramienta'],
    mutationFn: postUsoHerramienta,
    onSuccess: (data) => {
      console.log("Uso de herramienta creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['usosHerramientas'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo uso de herramienta registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el uso de herramienta:", error);
      addToast({
        title: 'Error al crear el uso de herramienta',
        description: 'No fue posible registrar nuevo uso de herramienta',
        color: 'danger'
      })
    },
  });
};

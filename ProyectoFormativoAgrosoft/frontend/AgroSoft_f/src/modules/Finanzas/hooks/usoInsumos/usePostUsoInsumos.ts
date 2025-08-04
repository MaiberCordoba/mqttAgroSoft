import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUsoInsumo } from "../../api/usoInsumosApi";
import { UsosInsumos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostUsoInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosInsumos, Error, UsosInsumos>({
    mutationKey: ['crearUsoInsumo'],
    mutationFn: postUsoInsumo,
    onSuccess: (data) => {
      console.log("Uso de insumo creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['usosInsumos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo uso de Insumo registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el uso de insumo:", error);
      addToast({
        title: 'Error al crear el uso de insumo',
        description: 'No fue posible registrar nuevo uso de insumo',
        color: 'danger'
      })
    },
  });
};

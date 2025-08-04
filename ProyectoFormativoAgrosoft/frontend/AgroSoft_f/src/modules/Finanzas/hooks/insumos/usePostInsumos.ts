import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postInsumo } from "../../api/insumosApi";
import { Insumos } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation<Insumos, Error,FormData,Insumos>({
    mutationKey: ['crearInsumo'],
    mutationFn: postInsumo,
    onSuccess: (data) => {
      console.log("Insumo creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['insumos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nuevo insumo registrado con éxito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el insumo:", error);
      addToast({
        title: 'Error al crear el insumo',
        description: 'No fue posible registrar un nuevo insumo',
        color: 'danger'
      })
    },
  });
};

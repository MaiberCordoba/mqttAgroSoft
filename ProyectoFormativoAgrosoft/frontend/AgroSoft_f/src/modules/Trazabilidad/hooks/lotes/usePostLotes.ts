import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLotes } from "../../api/lotesApi";
import { Lotes } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostLotes = () => {
  const queryClient = useQueryClient();

  return useMutation<Lotes, Error, Lotes>({
    mutationKey: ['crearLotes'],
    mutationFn: postLotes,
    onSuccess: (data) => {
      console.log("lote creada con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['Lotes'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nueva Lotes registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el lote:", error);
      addToast({
        title: 'Error al crear la Lotes',
        description: 'No fue posible  registrar nuevo Lotes',
        color: 'success'
      })
    },
  });
};
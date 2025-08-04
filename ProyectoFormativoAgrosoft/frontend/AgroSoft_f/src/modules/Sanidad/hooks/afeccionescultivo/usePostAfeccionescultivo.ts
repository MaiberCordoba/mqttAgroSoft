import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAfeccionesCultivo } from "../../api/afeccionescultivo";
import { AfeccionesCultivo } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostAfeccionCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation<AfeccionesCultivo, Error, AfeccionesCultivo>({
    mutationKey: ['crearAfeccionCultivo'],
    mutationFn: postAfeccionesCultivo,
    onSuccess: (data) => {
      console.log("Afección de cultivo creada con éxito:", data);

      // Invalida la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['afeccionesCultivo'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva afección de cultivo registrada con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear la afección de cultivo:", error);
      addToast({
        title: 'Error al crear la afección',
        description: 'No fue posible registrar la nueva afección de cultivo',
        color: 'danger'  // Cambié a 'danger' ya que es un error
      });
    },
  });
};

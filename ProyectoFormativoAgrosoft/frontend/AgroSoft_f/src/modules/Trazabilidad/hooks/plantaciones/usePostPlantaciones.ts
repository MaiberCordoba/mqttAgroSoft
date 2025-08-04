import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPlantaciones } from "../../api/plantacionesApi";
import { Plantaciones, PlantacionCreate } from "../../types"; // importa también PlantacionCreate
import { addToast } from "@heroui/toast";

export const usePostPlantaciones = () => {
  const queryClient = useQueryClient();

  return useMutation<Plantaciones, Error, PlantacionCreate>({ // <-- cambio aquí
    mutationKey: ['crearPlantaciones'],
    mutationFn: postPlantaciones,
    onSuccess: (data) => {
      console.log("Plantación creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['Plantaciones'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Nueva plantación registrada con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear la plantación:", error);
      addToast({
        title: 'Error al crear la plantación',
        description: 'No fue posible registrar nueva plantación',
      });
    },
  });
};

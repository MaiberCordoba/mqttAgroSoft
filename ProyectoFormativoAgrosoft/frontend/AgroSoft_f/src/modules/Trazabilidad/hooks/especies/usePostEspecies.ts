import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEspecies } from "../../api/especiesApi";
import { Especies } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostEspecies = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Especies, Error, FormData>({
    mutationKey: ['crearEspecies'],
    mutationFn: postEspecies,
    onSuccess: (data) => {
      console.log("Especie creada con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ['especies'] });
      addToast({
        title: 'Creación exitosa',
        description: 'Nueva especie registrada con éxito',
        color: 'success',
      });
    },
    onError: (error) => {
      console.error("Error al crear la especie:", error);
      addToast({
        title: 'Error al crear especie',
        description: 'No fue posible registrar la nueva especie',
        color: 'danger',
      });
    },
  });

  // Función que valida campos y ejecuta la mutación
  const createEspecie = (formData: FormData) => {
    // Validación simple: verifica que todos los campos estén completos
    // Aquí asumo que sabes qué campos necesita tu FormData. Ejemplo:
    if (
      !formData.get("nombre") ||
      !formData.get("descripcion")
      // agrega aquí otros campos obligatorios
    ) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor, complete todos los campos requeridos.",
        color: "warning",
      });
      return;
    }

    // Si pasa la validación, ejecuta la mutación
    mutation.mutate(formData);
  };

  return { ...mutation, createEspecie };
};

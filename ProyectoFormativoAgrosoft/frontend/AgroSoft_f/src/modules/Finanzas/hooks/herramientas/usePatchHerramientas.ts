import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchHerramientas } from '../../api/herramientasApi';
import { Herramientas } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchHerramientas = () => {
  const queryClient = useQueryClient();

  return useMutation<Herramientas, Error, { id: number; data: Partial<Herramientas> }>({
    mutationFn: ({ id, data }) => patchHerramientas(id, data),
    onSuccess: (updatedHerramienta, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Herramientas[]>(['herramientas'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((herramienta) =>
          herramienta.id === variables.id ? { ...herramienta, ...updatedHerramienta } : herramienta
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La herramienta se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la herramienta",
        color: "danger",
       
      });
    }
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEspecies } from '../../api/especiesApi';
import { Especies } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, { id: number; data: FormData | Partial<Especies> }>({
    mutationFn: ({ id, data }) => patchEspecies(id, data),
    onSuccess: (updatedEspecie, variables) => {
      queryClient.setQueryData<Especies[]>(['especies'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((especie) =>
          especie.id === variables.id ? { ...especie, ...updatedEspecie } : especie
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "La especie se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la especie",
        color: "danger",
      });
    }
  });
};

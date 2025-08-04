import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchSalarios } from '../../api/salariosApi';
import { Salarios } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchSalarios = () => {
  const queryClient = useQueryClient();

  return useMutation<Salarios, Error, { id: number; data: Partial<Salarios> }>({
    mutationFn: ({ id, data }) => patchSalarios(id, data),
    onSuccess: (updatedSalarios, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<Salarios[]>(['salarios'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((salario) =>
          salario.id === variables.id ? { ...salario, ...updatedSalarios } : salario
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El salario se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el salario",
        color: "danger",
       
      });
    }
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchAfeccionesCultivo } from '../../api/afeccionescultivo';
import { AfeccionesCultivo } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchAfeccionesCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation<AfeccionesCultivo, Error, { id: number; data: Partial<AfeccionesCultivo> }>({
    mutationFn: ({ id, data }) => patchAfeccionesCultivo(id, data),
    onSuccess: (updatedAfeccion, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<AfeccionesCultivo[]>(['afeccionesCultivo'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((afeccion) =>
          afeccion.id === variables.id ? { ...afeccion, ...updatedAfeccion } : afeccion
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La afección se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la afección",
        color: "danger",
      });
    }
  });
};

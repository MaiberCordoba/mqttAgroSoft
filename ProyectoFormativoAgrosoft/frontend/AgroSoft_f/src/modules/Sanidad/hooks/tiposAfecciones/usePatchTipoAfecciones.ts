import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTipoAfecciones } from '../../api/tipoAfecciones';
import { TiposAfecciones } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchTipoAfecciones = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposAfecciones, Error, { id: number; data: FormData }>({
    mutationFn: ({ id, data }) => patchTipoAfecciones(id, data),
    onSuccess: (updatedTipoAfeccion, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<TiposAfecciones[]>(['TiposAfecciones'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((tipoafeccion) =>
          tipoafeccion.id === variables.id ? { ...tipoafeccion, ...updatedTipoAfeccion } : tipoafeccion
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "el tipo de afeccion se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipo de afección",
        color: "danger",
       
      });
    }
  });
};
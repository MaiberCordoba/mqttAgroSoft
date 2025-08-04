import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsosHerramientas } from '../../api/usosHerramientasApi';
import { UsosHerramientas } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchUsosHerramientas = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosHerramientas, Error, { id: number; data: Partial<UsosHerramientas> }>({
    mutationFn: ({ id, data }) => patchUsosHerramientas(id, data),
    onSuccess: (updatedUsoHerramienta, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<UsosHerramientas[]>(['usosHerramientas'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((usoHerramienta) =>
          usoHerramienta.id === variables.id ? { ...usoHerramienta, ...updatedUsoHerramienta } : usoHerramienta
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El uso de herramienta se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el uso de herramienta",
        color: "danger",
       
      });
    }
  });
};

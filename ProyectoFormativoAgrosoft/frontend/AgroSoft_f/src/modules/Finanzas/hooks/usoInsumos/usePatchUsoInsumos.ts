import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUsosInsumos } from '../../api/usoInsumosApi';
import { UsosInsumos } from '../../types';
import { addToast } from "@heroui/toast";

export const usePatchUsosInsumos = () => {
  const queryClient = useQueryClient();

  return useMutation<UsosInsumos, Error, { id: number; data: Partial<UsosInsumos> }>({
    mutationFn: ({ id, data }) => patchUsosInsumos(id, data),
    onSuccess: (updatedUsoInsumo, variables) => {
      // Actualiza la caché después de una mutación exitosa
      queryClient.setQueryData<UsosInsumos[]>(['usosInsumos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((usoInsumo) =>
          usoInsumo.id === variables.id ? { ...usoInsumo, ...updatedUsoInsumo } : usoInsumo
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El uso de insumo se actualizó correctamente",
        color: "success",
     
      });
    },
    onError: (error) => {
      console.error(error)
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el uso de insumo",
        color: "danger",
       
      });
    }
  });
};

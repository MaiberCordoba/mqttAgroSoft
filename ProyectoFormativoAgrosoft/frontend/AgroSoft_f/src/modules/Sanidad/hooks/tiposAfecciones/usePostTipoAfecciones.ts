import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoAfecciones } from "../../api/tipoAfecciones";
import {  TiposAfecciones } from "../../types";
import { addToast } from "@heroui/toast";

export const usePostTipoAfeccion = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FormData, TiposAfecciones>({
    mutationKey: ['TiposAfecciones'],
    mutationFn: postTipoAfecciones,
    onSuccess: (data) => {
      console.log("tipo de afección fue creada con éxito:", data);

      queryClient.invalidateQueries({ queryKey: ['TiposAfecciones'] });

      addToast({
        title: 'Creacion exitosa',
        description: 'Nuevo tipo de afeccion registrada con Exito',
        color: 'success'
      })
    },
    onError: (error) => {
      console.error("Error al crear el tipo de afeccion:", error);
      addToast({
        title: 'Error al crear el tipode afeccion',
        description: 'No fue posible  registrar un nuevo tipo de afeccion',
        color: 'success'
      })
    },
  });
};
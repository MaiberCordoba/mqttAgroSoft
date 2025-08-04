import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTiposEspecie } from "../../api/tiposEspecieApi";
import { TiposEspecie } from "../../types";

export const usePostTiposEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposEspecie, Error, FormData>({
    mutationKey: ['crearTiposEspecie'],
    mutationFn: postTiposEspecie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposEspecie'] });
    },
  });
};

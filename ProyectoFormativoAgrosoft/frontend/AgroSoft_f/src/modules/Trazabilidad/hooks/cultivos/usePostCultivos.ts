import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCultivos } from "../../api/cultivosApi";
import { Cultivo } from "../../types";

export const usePostCultivos = () => {
  const queryClient = useQueryClient();

  return useMutation<Cultivo, Error, Cultivo>({
    mutationKey: ['crearCultivos'],
    mutationFn: postCultivos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cultivos'] });
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { getUnidadesMedida } from "../../api/unidadesMedidaApi";
import { UnidadesMedida } from "../../types";

export const useGetUnidadesMedida = () => {
    const query = useQuery<UnidadesMedida[], Error>({
    queryKey: ["unidadesMedida"], 
    queryFn: getUnidadesMedida, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};

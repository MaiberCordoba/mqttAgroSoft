import { useQuery } from "@tanstack/react-query";
import { getUnidadesTiempo } from "../../api/unidadesTiempoApi";
import { UnidadesTiempo } from "../../types";

export const useGetUnidadesTiempo = () => {
  const query = useQuery<UnidadesTiempo[], Error>({
    queryKey: ["unidadesTiempo"], 
    queryFn: getUnidadesTiempo, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};

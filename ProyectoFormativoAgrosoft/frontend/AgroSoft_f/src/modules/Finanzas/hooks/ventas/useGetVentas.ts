import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../api/ventasApi";
import { Ventas } from "../../types";

export const useGetVentas = () => {
  const query = useQuery<Ventas[], Error>({
    queryKey: ["ventas"], 
    queryFn: getVentas, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};

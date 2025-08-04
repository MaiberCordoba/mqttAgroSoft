import { useQuery } from "@tanstack/react-query";
import { getInsumos } from "../../api/insumosApi";
import { Insumos } from "../../types";

export const useGetInsumos = () => {
    const query = useQuery<Insumos[], Error>({
    queryKey: ["insumos"], 
    queryFn: getInsumos, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


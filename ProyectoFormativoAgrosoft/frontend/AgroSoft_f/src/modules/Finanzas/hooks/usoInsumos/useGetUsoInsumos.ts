import { useQuery } from "@tanstack/react-query";
import { getUsosInsumos } from "../../api/usoInsumosApi";
import { UsosInsumos } from "../../types";

export const useGetUsosInsumos = () => {
    const query = useQuery<UsosInsumos[], Error>({
    queryKey: ["usosInsumos"], 
    queryFn: getUsosInsumos, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


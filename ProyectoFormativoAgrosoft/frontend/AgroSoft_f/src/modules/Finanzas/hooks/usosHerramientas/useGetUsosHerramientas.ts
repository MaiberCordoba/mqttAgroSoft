import { useQuery } from "@tanstack/react-query";
import { getUsosHerramientas } from "../../api/usosHerramientasApi";
import { UsosHerramientas } from "../../types";

export const useGetUsosHerramientas = () => {
    const query = useQuery<UsosHerramientas[], Error>({
    queryKey: ["usosHerramientas"], 
    queryFn: getUsosHerramientas, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


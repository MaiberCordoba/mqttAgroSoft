import { useQuery } from "@tanstack/react-query";
import { getHerramientas } from "../../api/herramientasApi";
import { Herramientas } from "../../types";

export const useGetHerramientas = () => {
    const query = useQuery<Herramientas[], Error>({
    queryKey: ["herramientas"], 
    queryFn: getHerramientas, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


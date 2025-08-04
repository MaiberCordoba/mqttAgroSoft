import { useQuery } from "@tanstack/react-query";
import { getActividades } from "../../api/actividadesApi";
import { Actividades } from "../../types";

export const useGetActividades = () => {
    const query = useQuery<Actividades[], Error>({
    queryKey: ["actividades"], 
    queryFn: getActividades, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


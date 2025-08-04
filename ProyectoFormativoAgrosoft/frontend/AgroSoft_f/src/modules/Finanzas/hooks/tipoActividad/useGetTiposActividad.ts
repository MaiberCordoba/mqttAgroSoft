import { useQuery } from "@tanstack/react-query";
import { getTipoActividad } from "../../api/tipoActividadApi";
import { TipoActividad } from "../../types";

export const useGetTipoActividad = () => {
    const query = useQuery<TipoActividad[], Error>({
    queryKey: ["tipoActividad"], 
    queryFn: getTipoActividad, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


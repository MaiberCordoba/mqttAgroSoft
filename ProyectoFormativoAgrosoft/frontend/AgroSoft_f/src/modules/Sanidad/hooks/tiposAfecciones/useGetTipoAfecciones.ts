import { useQuery } from "@tanstack/react-query";
import { TiposAfecciones } from "../../types";
import { getTipoAfecciones } from "../../api/tipoAfecciones";

export const useGetTipoAfecciones = () => {
  const query = useQuery<TiposAfecciones[]>({
    queryKey: ["TiposAfecciones"], 
    queryFn: getTipoAfecciones,
  });

  return {
    ...query,
    refetch: query.refetch, // aseguras que refetch esté disponible
  };
};
import { useQuery } from "@tanstack/react-query";
import { TipoControl } from "../../types";
import { getTipoControl } from "../../api/tipoControl";

export const useGetTipoControl = () => {
  const query = useQuery<TipoControl[]>({
    queryKey: ["TipoControl"],
    queryFn: getTipoControl,
  });

  return{
    ...query,
    refetch: query.refetch, // pasamos refetch para recargar componente padre 
  }
};

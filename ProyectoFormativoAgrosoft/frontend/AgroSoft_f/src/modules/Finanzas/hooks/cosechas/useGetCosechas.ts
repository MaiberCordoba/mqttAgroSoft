import { useQuery } from "@tanstack/react-query";
import { getCosechas } from "../../api/cosechasApi";
import { Cosechas } from "../../types";

export const useGetCosechas = () => {
    const query = useQuery<Cosechas[], Error>({
    queryKey: ["cosechas"], 
    queryFn: getCosechas, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


import { useQuery } from "@tanstack/react-query";
import { getSemilleros } from "../../api/semillerosApi";
import { Semillero } from "../../types";

export const useGetSemilleros = () => {
  return useQuery<Semillero[], Error>({
    queryKey: ["Semilleros"], 
    queryFn: getSemilleros, 
  });
};


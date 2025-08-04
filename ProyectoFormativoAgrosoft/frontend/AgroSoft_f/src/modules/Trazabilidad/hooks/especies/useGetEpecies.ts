import { useQuery } from "@tanstack/react-query";
import { getEspecies } from "../../api/especiesApi";
import { Especies } from "../../types";

export const useGetEspecies = () => {
  return useQuery<Especies[], Error>({
    queryKey: ["especies"], 
    queryFn: getEspecies, 
  });
};


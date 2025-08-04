import { useQuery } from "@tanstack/react-query";
import { getTiposEspecie } from "../../api/tiposEspecieApi";
import { TiposEspecie } from "../../types";

export const useGetTiposEspecie = () => {
  return useQuery<TiposEspecie[], Error>({
    queryKey: ["tiposEspecie"], 
    queryFn: getTiposEspecie, 
  });
};


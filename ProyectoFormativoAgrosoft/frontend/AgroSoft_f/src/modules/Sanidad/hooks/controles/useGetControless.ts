import { useQuery } from "@tanstack/react-query";
import { getControles } from "../../api/controles";
import { Controles } from "../../types";

export const useGetControles = () => {
  return useQuery<Controles[], Error>({
    queryKey: ["controles"], 
    queryFn: getControles, 
  });
};

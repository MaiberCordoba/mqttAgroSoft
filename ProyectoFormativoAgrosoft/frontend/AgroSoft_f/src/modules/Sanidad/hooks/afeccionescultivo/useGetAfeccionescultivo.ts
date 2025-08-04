import { useQuery } from "@tanstack/react-query";
import { getAfeccionesCultivo } from "../../api/afeccionescultivo";
import { AfeccionesCultivo } from "../../types";

export const useGetAfeccionesCultivo = () => {
  return useQuery<AfeccionesCultivo[], Error>({
    queryKey: ["afeccionesCultivo"], 
    queryFn: getAfeccionesCultivo, 
  });
};

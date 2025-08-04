import { useQuery } from "@tanstack/react-query";
import { getLotes } from "../../api/lotesApi";
import { Lotes } from "../../types";

export const useGetLotes = () => {
  return useQuery<Lotes[], Error>({
    queryKey: ["Lotes"], 
    queryFn: getLotes, 
  });
};


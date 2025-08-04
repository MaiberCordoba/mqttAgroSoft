import { useQuery } from "@tanstack/react-query";
import { getSalarios } from "../../api/salariosApi";
import { Salarios } from "../../types";

export const useGetSalarios = () => {
    const query = useQuery<Salarios[], Error>({
    queryKey: ["salarios"], 
    queryFn: getSalarios, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


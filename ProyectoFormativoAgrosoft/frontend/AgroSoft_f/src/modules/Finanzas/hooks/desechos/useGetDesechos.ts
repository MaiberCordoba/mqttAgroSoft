import { useQuery } from "@tanstack/react-query";
import { getDesechos } from "../../api/desechosApi";
import { Desechos } from "../../types";

export const useGetDesechos = () => {
    const query = useQuery<Desechos[], Error>({
    queryKey: ["desechos"], 
    queryFn: getDesechos, 
  });
  return{
    ...query,
    refetch : query.refetch
  }
};


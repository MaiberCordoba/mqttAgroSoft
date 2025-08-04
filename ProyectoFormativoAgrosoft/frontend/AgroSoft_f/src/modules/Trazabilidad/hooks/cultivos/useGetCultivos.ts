import { useQuery } from "@tanstack/react-query";
import { getCultivos } from "../../api/cultivosApi";
import { Cultivo } from "../../types";

export const useGetCultivos = () => {
  return useQuery<Cultivo[], Error>({
    queryKey: ["cultivos"],
    queryFn: getCultivos,
  });
};

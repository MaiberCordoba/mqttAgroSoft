import { useQuery } from "@tanstack/react-query";
import { getPlantaciones } from "../../api/plantacionesApi";
import { Plantaciones } from "../../types";

export const useGetPlantaciones = () => {
  return useQuery<Plantaciones[], Error>({
    queryKey: ["Plantaciones"],
    queryFn: getPlantaciones,
  });
};

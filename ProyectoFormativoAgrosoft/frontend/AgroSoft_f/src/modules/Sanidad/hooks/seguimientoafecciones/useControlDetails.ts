// ✅ Hook - useControles
import { useQuery } from "@tanstack/react-query";
import { getAllControles } from "@/modules/Sanidad/api/seguimientoAfeccionesApi";
import { ControlDetails } from "../../types";

export const useControles = () => {
  return useQuery<ControlDetails[]>({
    queryKey: ["controles"],
    queryFn: getAllControles,
  });
};

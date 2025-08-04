import { useQuery } from "@tanstack/react-query";
import { DetalleResumenEconomico } from "../../types";
import { getResumenEconomico } from "../../api/finanzasCultivoApi";

export const useResumenEconomico = (cultivoId: number) => {
  return useQuery<DetalleResumenEconomico, Error>({
    queryKey: ["resumen-economico", cultivoId],
    queryFn: () => getResumenEconomico(cultivoId),
    enabled: !!cultivoId, // Solo se ejecuta si cultivoId tiene valor
  });
};

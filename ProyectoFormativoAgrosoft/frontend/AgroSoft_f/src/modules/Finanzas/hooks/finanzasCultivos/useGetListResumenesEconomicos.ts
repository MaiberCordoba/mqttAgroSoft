import { useQuery } from "@tanstack/react-query";
import { ResumenEconomicoListado } from "../../types";
import { getResumenesEconomicos } from "../../api/finanzasCultivoApi";

export const useResumenesEconomicos = () => {
  return useQuery<ResumenEconomicoListado[], Error>({
    queryKey: ["resumenes-economicos"], 
    queryFn: getResumenesEconomicos,
  });
};
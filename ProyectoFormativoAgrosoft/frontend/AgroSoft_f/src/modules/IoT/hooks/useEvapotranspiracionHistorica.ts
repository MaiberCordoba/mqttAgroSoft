import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ETData {
  fecha: string;
  et_mm_dia: number;
  kc: number;
  sensor_data: {
    temperatura: number;
    viento: number;
    iluminacion: number;
    humedad: number;
  };
}

export const useEvapotranspiracionHistorica = (cultivoId: number, loteId: number) => {
  return useQuery<ETData[]>({
    queryKey: ["etHistorica", cultivoId, loteId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/evapotranspiracion/historica/`, {
        params: { cultivo_id: cultivoId, lote_id: loteId }
      });
      return res.data;
    },
    enabled: !!cultivoId && !!loteId,
    staleTime: 1000 * 60 * 5, 
  });
};
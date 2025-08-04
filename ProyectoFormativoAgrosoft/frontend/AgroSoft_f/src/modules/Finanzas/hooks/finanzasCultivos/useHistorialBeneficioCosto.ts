import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

interface HistorialBeneficioCosto {
  cultivo_id: number;
  nombre_cultivo: string;
  fecha_registro: string;
  costo_insumos: number;
  total_mano_obra: number;
  total_costos: number;
  total_ventas: number;
  beneficio: number;
  relacion_beneficio_costo: number;
}

interface FetchParams {
  cultivosIds?: number[];
  fechaInicio?: string;
  fechaFin?: string;
}

const fetchHistorial = async (params: FetchParams) => {
  const queryParams = new URLSearchParams();

  if (params.cultivosIds?.length) {
    params.cultivosIds.forEach((id) => {
      queryParams.append("cultivos_ids[]", id.toString());
    });
  }

  if (params.fechaInicio)
    queryParams.append("fecha_inicio", params.fechaInicio);
  if (params.fechaFin) queryParams.append("fecha_fin", params.fechaFin);

  const response = await apiClient.get<HistorialBeneficioCosto[]>(
    "lista/historial-beneficio-costo/",
    { params: queryParams }
  );
  return response.data;
};

export const useHistorialBeneficioCosto = ({
  cultivosIds,
  fechaInicio,
  fechaFin,
}: FetchParams) => {
  return useQuery({
    queryKey: ["historial-beneficio-costo", cultivosIds, fechaInicio, fechaFin],
    queryFn: () => fetchHistorial({ cultivosIds, fechaInicio, fechaFin }),
    enabled: !cultivosIds || cultivosIds.length > 0, // Solo ejecuta si cultivosIds está definido y no vacío
  });
};

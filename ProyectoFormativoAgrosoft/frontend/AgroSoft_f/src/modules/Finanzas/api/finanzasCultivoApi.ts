import apiClient from "@/api/apiClient";
import {DetalleResumenEconomico, ResumenEconomicoListado } from "../types";


export const getResumenesEconomicos = async (): Promise<ResumenEconomicoListado[]> => {
  const response = await apiClient.get("lista/resumen_economico/");
  return response.data;
};

export const getResumenEconomico = async (cultivoId: number): Promise<DetalleResumenEconomico> => {
  const response = await apiClient.get(`cultivos/${cultivoId}/resumen-economico/`);
  return response.data;
};
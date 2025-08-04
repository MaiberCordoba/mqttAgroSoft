import apiClient from "@/api/apiClient";
import { UnidadesTiempo } from "../types"; 

export const getUnidadesTiempo = async (): Promise<UnidadesTiempo[]> => {
  const response = await apiClient.get("unidades-tiempo/");
  return response.data;
};


export const postUnidadesTiempo = async (unidadTiempoData: Partial<UnidadesTiempo>): Promise<UnidadesTiempo> => {
  const response = await apiClient.post("unidades-tiempo/", unidadTiempoData);
  return response.data;
};


export const patchUnidadesTiempo = async (id: number, data: Partial<UnidadesTiempo>): Promise<UnidadesTiempo> => {
  const response = await apiClient.patch<UnidadesTiempo>(`unidades-tiempo/${id}/`, data);
  return response.data;
};


export const deleteUnidadesTiempo = async (id: number): Promise<UnidadesTiempo> => {
  const response = await apiClient.delete<UnidadesTiempo>(`unidades-tiempo/${id}/`);
  return response.data;
};

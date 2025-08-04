import apiClient from "@/api/apiClient";
import { TiempoActividadControl } from "../types";

export const getTiempoActividadControl = async (): Promise<TiempoActividadControl[]> => {
  const response = await apiClient.get("tiempoActividadesControles/")
  return response.data
}

export const postTiempoActividadControl = async (TiempoActividadControlData: Partial<TiempoActividadControl>): Promise<TiempoActividadControl> => {
  const response = await apiClient.post("tiempoActividadesControles/", TiempoActividadControlData);
  return response.data;
};

export const patchTiempoActividadControl = async ( id: number, data: Partial<TiempoActividadControl>): Promise<TiempoActividadControl> => {
    const response = await apiClient.patch<TiempoActividadControl>(`tiempoActividadesControles/${id}/`, data);
    return response.data;
  };

  export const deleteTiempoActividadControl = async (id: number): Promise<TiempoActividadControl> => {
    const response = await apiClient.delete<TiempoActividadControl>(`tiempoActividadesControles/${id}/`);
    return response.data
}
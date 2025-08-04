import apiClient from "@/api/apiClient";
import { TipoActividad } from "../types";

export const getTipoActividad = async (): Promise<TipoActividad[]> => {
  const response = await apiClient.get("tipo-actividad/")
  return response.data
}

export const postTipoActividad = async (TipoActividadData: Partial<TipoActividad>): Promise<TipoActividad> => {
  const response = await apiClient.post("tipo-actividad/", TipoActividadData);
  return response.data;
};

export const patchTipoActividad = async ( id: number, data: Partial<TipoActividad>): Promise<TipoActividad> => {
    const response = await apiClient.patch<TipoActividad>(`tipo-actividad/${id}/`, data);
    return response.data;
  };

  export const deleteTipoActividad = async (id: number): Promise<TipoActividad> => {
    const response = await apiClient.delete<TipoActividad>(`tipo-actividad/${id}/`);
    return response.data
}
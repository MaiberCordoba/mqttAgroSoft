import apiClient from "@/api/apiClient";
import { UsosInsumos } from "../types";

export const getUsosInsumos = async (): Promise<UsosInsumos[]> => {
  const response = await apiClient.get("usos-insumos/")
  return response.data
}

export const postUsoInsumo = async (UsosInsumosData: Partial<UsosInsumos>): Promise<UsosInsumos> => {
  const response = await apiClient.post("usos-insumos/", UsosInsumosData);
  return response.data;
};

export const patchUsosInsumos = async ( id: number, data: Partial<UsosInsumos>): Promise<UsosInsumos> => {
    const response = await apiClient.patch<UsosInsumos>(`usos-insumos/${id}/`, data);
    return response.data;
  };

  export const deleteUsosInsumos = async (id: number): Promise<UsosInsumos> => {
    const response = await apiClient.delete<UsosInsumos>(`usos-insumos/${id}/`);
    return response.data
}
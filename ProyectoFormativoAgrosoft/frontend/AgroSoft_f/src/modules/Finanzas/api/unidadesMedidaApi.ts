import apiClient from "@/api/apiClient";
import { UnidadesMedida } from "../types";

export const getUnidadesMedida = async (): Promise<UnidadesMedida[]> => {
  const response = await apiClient.get("unidades-medida/")
  return response.data
}

export const postUnidadMedida = async (UnidadesMedidaData: Partial<UnidadesMedida>): Promise<UnidadesMedida> => {
  const response = await apiClient.post("unidades-medida/", UnidadesMedidaData);
  return response.data;
};

export const patchUnidadesMedida = async ( id: number, data: Partial<UnidadesMedida>): Promise<UnidadesMedida> => {
    const response = await apiClient.patch<UnidadesMedida>(`unidades-medida/${id}/`, data);
    return response.data;
  };

  export const deleteUnidadesMedida = async (id: number): Promise<UnidadesMedida> => {
    const response = await apiClient.delete<UnidadesMedida>(`unidades-medida/${id}/`);
    return response.data
}
import apiClient from "@/api/apiClient";
import { Desechos } from "../types";

export const getDesechos = async (): Promise<Desechos[]> => {
  const response = await apiClient.get("desechos/")
  return response.data
}

export const postDesecho = async (DesechosData: Partial<Desechos>): Promise<Desechos> => {
  const response = await apiClient.post("desechos/", DesechosData);
  return response.data;
};

export const patchDesechos = async ( id: number, data: Partial<Desechos>): Promise<Desechos> => {
    const response = await apiClient.patch<Desechos>(`desechos/${id}/`, data);
    return response.data;
  };

  export const deleteDesechos = async (id: number): Promise<Desechos> => {
    const response = await apiClient.delete<Desechos>(`desechos/${id}/`);
    return response.data
}
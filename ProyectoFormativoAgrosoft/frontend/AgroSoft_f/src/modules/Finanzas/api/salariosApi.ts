import apiClient from "@/api/apiClient";
import { Salarios } from "../types";

export const getSalarios = async (): Promise<Salarios[]> => {
  const response = await apiClient.get("salarios/")
  return response.data
}

export const postSalario = async (SalariosData: Partial<Salarios>): Promise<Salarios> => {
  const response = await apiClient.post("salarios/", SalariosData);
  return response.data;
};

export const patchSalarios = async ( id: number, data: Partial<Salarios>): Promise<Salarios> => {
    const response = await apiClient.patch<Salarios>(`salarios/${id}/`, data);
    return response.data;
  };

  export const deleteSalarios = async (id: number): Promise<Salarios> => {
    const response = await apiClient.delete<Salarios>(`salarios/${id}/`);
    return response.data
}
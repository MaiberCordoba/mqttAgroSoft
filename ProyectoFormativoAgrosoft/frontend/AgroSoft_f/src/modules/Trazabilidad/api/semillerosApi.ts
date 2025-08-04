import apiClient from "@/api/apiClient";
import { Semillero } from "../types";

export const getSemilleros = async (): Promise<Semillero[]> => {
  const response = await apiClient.get("semilleros/");
  return response.data;
};

export const postSemilleros = async (data?: any): Promise<Semillero> => {
  const response = await apiClient.post<Semillero>("semilleros/", data);
  return response.data;
};

export const patchSemilleros = async (
  id: number,
  data: Partial<Semillero>
): Promise<Semillero> => {
  const response = await apiClient.patch<Semillero>(`semilleros/${id}/`, data);
  return response.data;
};

export const deleteSemilleros = async (id: number): Promise<Semillero> => {
  const response = await apiClient.delete<Semillero>(`semilleros/${id}/`);
  return response.data;
};

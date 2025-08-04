import apiClient from "@/api/apiClient";
import { Plantaciones } from "../types";

export const getPlantaciones = async (): Promise<Plantaciones[]> => {
  const response = await apiClient.get("plantaciones/");
  return response.data; // Retorna los datos directamente
};

export const postPlantaciones = async (data: any): Promise<Plantaciones> => {
  const response = await apiClient.post<Plantaciones>("plantaciones/", data);
  return response.data;
};

export const patchPlantaciones = async (
  id: number,
  data: Partial<Plantaciones>
): Promise<Plantaciones> => {
  const response = await apiClient.patch<Plantaciones>(
    `plantaciones/${id}/`,
    data
  );
  return response.data;
};

export const deletePlantaciones = async (id: number): Promise<Plantaciones> => {
  const response = await apiClient.delete<Plantaciones>(`plantaciones/${id}/`);
  return response.data;
};

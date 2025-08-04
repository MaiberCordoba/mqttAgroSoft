import apiClient from "@/api/apiClient";
import { Especies } from "../types";

// Obtener todas las especies
export const getEspecies = async (): Promise<Especies[]> => {
  const response = await apiClient.get("especies/");
  return response.data;
};

// Crear nueva especie (puede incluir imágenes en FormData)
export const postEspecies = async (data: FormData): Promise<Especies> => {
  const response = await apiClient.post<Especies>("especies/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Editar especie (puede usar FormData o JSON)
export const patchEspecies = async (
  id: number,
  data: FormData | Partial<Especies>
): Promise<Especies> => {
  const response = await apiClient.patch<Especies>(`especies/${id}/`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data;
};

// Eliminar especie
export const deleteEspecies = async (id: number): Promise<void> => {
  await apiClient.delete(`especies/${id}/`);
};

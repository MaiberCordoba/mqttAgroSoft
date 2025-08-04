import apiClient from "@/api/apiClient";
import { TiposEspecie } from "../types";

// Obtener todos los tipos de especie
export const getTiposEspecie = async (): Promise<TiposEspecie[]> => {
  const response = await apiClient.get("tiposespecie/");
  return response.data;
};

// Crear un nuevo tipo de especie (usando FormData)
export const postTiposEspecie = async (data: FormData): Promise<TiposEspecie> => {
  const response = await apiClient.post<TiposEspecie>('tiposespecie/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Actualizar un tipo de especie (también con FormData)
export const patchTiposEspecie = async (id: number, data: FormData): Promise<TiposEspecie> => {
  const response = await apiClient.patch<TiposEspecie>(`tiposespecie/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Eliminar un tipo de especie
export const deleteTiposEspecie = async (id: number): Promise<TiposEspecie> => {
  const response = await apiClient.delete<TiposEspecie>(`tiposespecie/${id}/`);
  return response.data;
};

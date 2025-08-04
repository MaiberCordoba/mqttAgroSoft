import apiClient from "@/api/apiClient";
import { Herramientas } from "../types";

export const getHerramientas = async (): Promise<Herramientas[]> => {
  const response = await apiClient.get("herramientas/")
  return response.data
}

export const postHerramienta = async (HerramientasData: Partial<Herramientas>): Promise<Herramientas> => {
  const response = await apiClient.post("herramientas/", HerramientasData);
  return response.data;
};

export const patchHerramientas = async ( id: number, data: Partial<Herramientas>): Promise<Herramientas> => {
    const response = await apiClient.patch<Herramientas>(`herramientas/${id}/`, data);
    return response.data;
  };

  export const deleteHerramientas = async (id: number): Promise<Herramientas> => {
    const response = await apiClient.delete<Herramientas>(`herramientas/${id}/`);
    return response.data
}
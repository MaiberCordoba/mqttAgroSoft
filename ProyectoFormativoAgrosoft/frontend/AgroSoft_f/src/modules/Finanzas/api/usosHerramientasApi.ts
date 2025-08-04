import apiClient from "@/api/apiClient";
import { UsosHerramientas } from "../types";

export const getUsosHerramientas = async (): Promise<UsosHerramientas[]> => {
  const response = await apiClient.get("usosherramientas/")
  return response.data
}

export const postUsoHerramienta = async (UsosHerramientasData: Partial<UsosHerramientas>): Promise<UsosHerramientas> => {
  const response = await apiClient.post("usosherramientas/", UsosHerramientasData);
  return response.data;
};

export const patchUsosHerramientas = async ( id: number, data: Partial<UsosHerramientas>): Promise<UsosHerramientas> => {
    const response = await apiClient.patch<UsosHerramientas>(`usosherramientas/${id}/`, data);
    return response.data;
  };

  export const deleteUsosHerramientas = async (id: number): Promise<UsosHerramientas> => {
    const response = await apiClient.delete<UsosHerramientas>(`usosherramientas/${id}/`);
    return response.data
}
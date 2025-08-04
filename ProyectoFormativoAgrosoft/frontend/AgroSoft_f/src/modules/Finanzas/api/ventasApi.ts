import apiClient from "@/api/apiClient";
import { Ventas } from "../types";

export const getVentas = async (): Promise<Ventas[]> => {
  const response = await apiClient.get("ventas/")
  return response.data
}

export const postVentas = async (VentasData: Partial<Ventas>): Promise<Ventas> => {
  const response = await apiClient.post("ventas/", VentasData);
  return response.data;
};

export const patchVentas = async ( id: number, data: Partial<Ventas>): Promise<Ventas> => {
    const response = await apiClient.patch<Ventas>(`ventas/${id}/`, data);
    return response.data;
  };

  export const deleteVentas = async (id: number): Promise<Ventas> => {
    const response = await apiClient.delete<Ventas>(`ventas/${id}/`);
    return response.data
}
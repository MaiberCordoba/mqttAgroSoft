import apiClient from "@/api/apiClient";
import { MovimientoInventario } from "../types";

export const getMovimientoInventario = async (): Promise<MovimientoInventario[]> => {
  const response = await apiClient.get("movimiento-inventario/")
  return response.data
}

export const postMovimientoInventario = async (MovimientoInventarioData: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
  const response = await apiClient.post("movimiento-inventario/", MovimientoInventarioData);
  return response.data;
};

export const patchMovimientoInventario = async ( id: number, data: Partial<MovimientoInventario>): Promise<MovimientoInventario> => {
    const response = await apiClient.patch<MovimientoInventario>(`movimiento-inventario/${id}/`, data);
    return response.data;
  };

  export const deleteMovimientoInventario = async (id: number): Promise<MovimientoInventario> => {
    const response = await apiClient.delete<MovimientoInventario>(`movimiento-inventario/${id}/`);
    return response.data
}
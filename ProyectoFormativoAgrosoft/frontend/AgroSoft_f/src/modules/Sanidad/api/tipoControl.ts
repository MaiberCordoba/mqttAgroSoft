import apiClient from "@/api/apiClient";
import { TipoControl } from "../types";

export const getTipoControl = async (): Promise<TipoControl[]> => {
    const response = await apiClient.get("tiposControl/");
    return response.data;
};

export const postTipoControl = async (data?: any): Promise<TipoControl> => {
    const response = await apiClient.post<TipoControl>("tiposControl/", data);
    return response.data;
};

export const patchTipoControl = async (id: number, data: Partial<TipoControl>): Promise<TipoControl> => {
    const response = await apiClient.patch<TipoControl>(`tiposControl/${id}/`, data);
    return response.data;
};

export const deleteTipoControl = async (id: number): Promise<TipoControl> => {
    const response = await apiClient.delete<TipoControl>(`tiposControl/${id}/`);
    return response.data;
};

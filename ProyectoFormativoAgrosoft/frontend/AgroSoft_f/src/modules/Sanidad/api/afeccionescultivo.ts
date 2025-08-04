import apiClient from "@/api/apiClient";
import { AfeccionesCultivo } from "../types";

export const getAfeccionesCultivo = async (): Promise<AfeccionesCultivo[]> => {
    const response = await apiClient.get("afecciones/");
    return response.data;
};

export const postAfeccionesCultivo = async (data?: any): Promise<AfeccionesCultivo> => {
    const response = await apiClient.post<AfeccionesCultivo>("afecciones/", data);
    return response.data;
};

export const patchAfeccionesCultivo = async (id: number, data: Partial<AfeccionesCultivo>): Promise<AfeccionesCultivo> => {
    const response = await apiClient.patch<AfeccionesCultivo>(`afecciones/${id}/`, data);
    return response.data;
};

export const deleteAfeccionesCultivo = async (id: number): Promise<AfeccionesCultivo> => {
    const response = await apiClient.delete<AfeccionesCultivo>(`afecciones/${id}/`);
    return response.data;
};

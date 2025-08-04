import apiClient from "@/api/apiClient";
import { Controles } from "../types";

export const getControles = async (): Promise<Controles[]> => {
    const response = await apiClient.get("controles/");
    return response.data;
};

export const postcontroles = async (data?: any): Promise<Controles> => {
    const response = await apiClient.post<Controles>("controles/", data);
    return response.data;
};

export const patchControles = async (id: number, data: Partial<Controles>): Promise<Controles> => {
    const response = await apiClient.patch<Controles>(`controles/${id}/`, data);
    return response.data;
};

export const deleteControles = async (id: number): Promise<Controles> => {
    const response = await apiClient.delete<Controles>(`controles/${id}/`);
    return response.data;
};

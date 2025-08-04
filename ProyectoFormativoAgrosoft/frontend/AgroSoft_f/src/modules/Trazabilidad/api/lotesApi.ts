import apiClient from "@/api/apiClient";
import { Lotes } from "../types";

export const getLotes = async ():Promise<Lotes[]> => {
    const response = await apiClient.get("lote/");
    return response.data
};

export const postLotes = async (data?:any):Promise<Lotes> => {
    const response = await apiClient.post<Lotes>('lote/',data);
    return response.data
}

export const patchLotes = async ( id: number, data: Partial<Lotes>): Promise<Lotes> => {
    const response = await apiClient.patch<Lotes>(`lote/${id}/`, data);
    return response.data;
  };


export const deleteLotes = async (id: number): Promise<Lotes> => {
    const response = await apiClient.delete<Lotes>(`lote/${id}/`);
    return response.data
}
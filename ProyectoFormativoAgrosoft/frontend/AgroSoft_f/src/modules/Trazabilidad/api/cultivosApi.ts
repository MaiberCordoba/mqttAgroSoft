import apiClient from "@/api/apiClient";
import { Cultivo } from "../types";

export const getCultivos = async ():Promise<Cultivo[]> => {
    const response = await apiClient.get("cultivos/");
    return response.data
};

export const postCultivos = async (data?:any):Promise<Cultivo> => {
    const response = await apiClient.post<Cultivo>('cultivos/',data);
    return response.data
}

export const patchCultivos = async ( id: number, data: Partial<Cultivo>): Promise<Cultivo> => {
    const response = await apiClient.patch<Cultivo>(`cultivos/${id}/`, data);
    return response.data;
  };


export const deleteCultivos = async (id: number): Promise<Cultivo> => {
    const response = await apiClient.delete<Cultivo>(`cultivos/${id}/`);
    return response.data
}
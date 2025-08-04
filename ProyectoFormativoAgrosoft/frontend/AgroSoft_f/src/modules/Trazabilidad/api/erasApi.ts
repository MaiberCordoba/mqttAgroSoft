import apiClient from "@/api/apiClient";
import { Eras } from "../types";

export const getEras = async ():Promise<Eras[]> => {
    const response = await apiClient.get("eras/");
    return response.data
};

export const postEras = async (data?:any):Promise<Eras> => {
    const response = await apiClient.post<Eras>('eras/',data);
    return response.data
}

export const patchEras = async ( id: number, data: Partial<Eras>): Promise<Eras> => {
    const response = await apiClient.patch<Eras>(`eras/${id}/`, data);
    return response.data;
  };


export const deleteEras = async (id: number): Promise<Eras> => {
    const response = await apiClient.delete<Eras>(`eras/${id}/`);
    return response.data
}
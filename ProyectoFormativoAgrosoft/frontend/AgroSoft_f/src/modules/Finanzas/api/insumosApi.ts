import apiClient from "@/api/apiClient";
import { Insumos } from "../types";

export const getInsumos = async (): Promise<Insumos[]> => {
  const response = await apiClient.get("insumos/")
  return response.data
}

export const postInsumo = async (data: FormData): Promise<Insumos> => {
  const response = await apiClient.post<Insumos>("insumos/",data,{
    headers : {
      "Content-Type" : "multipart/form-data"
    }
  })
  return response.data
}

export const patchInsumos = async ( id: number, data: FormData): Promise<Insumos> => {
      const response = await apiClient.patch<Insumos>(`insumos/${id}/`,data,{
    headers : {
      "Content-Type" : "multipart/form-data"
    }
  })
  return response.data
  };

  export const deleteInsumos = async (id: number): Promise<Insumos> => {
    const response = await apiClient.delete<Insumos>(`insumos/${id}/`);
    return response.data
}
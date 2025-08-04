import apiClient from "@/api/apiClient";
import {  TiposAfecciones } from "../types";

export const getTipoAfecciones = async ():Promise<TiposAfecciones[]> => {
    const response = await apiClient.get("tipoPlaga/");
    return response.data
};

export const postTipoAfecciones = async (data: FormData): Promise<TiposAfecciones> => {
    const response = await apiClient.post<TiposAfecciones>('tipoPlaga/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

export const patchTipoAfecciones = async ( id: number, data: FormData): Promise<TiposAfecciones> => {
    const response = await apiClient.patch<TiposAfecciones>(`tipoPlaga/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return response.data;
  };


export const deleteTipoAfecciones = async (id: number): Promise<TiposAfecciones> => {
    const response = await apiClient.delete<TiposAfecciones>(`tipoPlaga/${id}/`);
    return response.data
}
import apiClient from "@/api/apiClient";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("usuarios/");
  return response.data;
};

export const registerUser = async (
  userData: Partial<User>
): Promise<User> => {
  const response = await apiClient.post("usuarios/", userData);
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  console.log("Enviando datos al backend para actualizar usuario:", id, userData);
  const response = await apiClient.patch(`usuarios/${id}/`, userData);
  console.log("Respuesta del backend:", response.data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<User> => {
  const response = await apiClient.delete<User>(`usuarios/${id}/`);
  return response.data;
};

// Nueva función para el reporte de usuarios
enum Endpoints {
  Reporte = "usuarios/reporte/",
}

export const getReporteUsuarios = async () => {
  const response = await apiClient.get(Endpoints.Reporte);
  return response.data as {
    total_usuarios: number;
    usuarios_activos: number;
    usuarios_inactivos: number;
  };
};
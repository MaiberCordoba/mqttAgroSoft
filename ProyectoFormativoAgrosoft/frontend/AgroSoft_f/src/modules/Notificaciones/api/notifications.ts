// services/notificaciones.ts
import apiClient from "@/api/apiClient";
import { Notificacion } from "../types"; // crea un tipo Notificacion si no lo tienes

export const getNotificaciones = async (): Promise<Notificacion[]> => {
  const response = await apiClient.get("/notifications/");
  return response.data;
};

export const marcarComoLeida = async (id: number): Promise<Notificacion> => {
  const response = await apiClient.patch(`/notifications/${id}/mark_as_read/`);
  return response.data;
};

export const marcarTodasComoLeidas = async (): Promise<void> => {
  await apiClient.patch(`/notifications/mark_all_as_read/`);
};

// hooks/useNotificaciones.ts
import { useEffect, useState } from "react";
import { Notificacion } from "../types";
import { useAuth } from "@/hooks/UseAuth";
import {
  getNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
} from "../api/notifications";
import { useSocketNotificaciones } from "./useSocketNotifications";

export const useNotificaciones = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (!userId) {
      setNotificaciones([]);
      return;
    }

    const fetchNotificaciones = async () => {
      try {
        const data = await getNotificaciones();
        console.log("Notificaciones cargadas:", data); // Depuración
        setNotificaciones(data);
      } catch (err) {
        console.error("Error al cargar notificaciones", err);
      }
    };

    fetchNotificaciones();
  }, [userId]);

  // Integrar WebSocket para notificaciones en tiempo real
  useSocketNotificaciones((noti: Notificacion) => {
    setNotificaciones((prev) => {
      // Evitar duplicados verificando el ID
      if (prev.some((n) => n.id === noti.id)) {
        console.log("Notificación duplicada recibida por WebSocket:", noti); // Depuración
        return prev;
      }
      console.log("Nueva notificación recibida por WebSocket:", noti); // Depuración
      return [noti, ...prev];
    });
  });

  const marcarLeida = async (id: number) => {
    // Actualización optimista: Actualizar el estado localmente
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );

    try {
      await marcarComoLeida(id);
      console.log("Notificación marcada como leída en el backend:", id); // Depuración
    } catch (err) {
      console.error("Error al marcar como leída en el backend:", err);
      // Revertir cambio optimista o recargar desde el backend
      try {
        const data = await getNotificaciones();
        console.log("Notificaciones recargadas después de error:", data); // Depuración
        setNotificaciones(data);
      } catch (fetchErr) {
        console.error("Error al recargar notificaciones:", fetchErr);
      }
    }
  };

  const marcarTodasLeidas = async () => {
    // Actualización optimista: Actualizar todas las notificaciones localmente
    setNotificaciones((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    try {
      await marcarTodasComoLeidas();
      console.log("Todas las notificaciones marcadas como leídas en el backend"); // Depuración
    } catch (err) {
      console.error("Error al marcar todas como leídas en el backend:", err);
      // Revertir cambio optimista o recargar desde el backend
      try {
        const data = await getNotificaciones();
        console.log("Notificaciones recargadas después de error:", data); // Depuración
        setNotificaciones(data);
      } catch (fetchErr) {
        console.error("Error al recargar notificaciones:", fetchErr);
      }
    }
  };

  return {
    notificaciones,
    marcarLeida,
    marcarTodasLeidas,
  };
};
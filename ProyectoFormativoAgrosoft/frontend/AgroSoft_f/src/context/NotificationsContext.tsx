// context/NotificationsContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { Notificacion } from "@/modules/Notificaciones/types";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "@/modules/Notificaciones/api/notifications";
import { useSocketNotificaciones } from "@/modules/Notificaciones/hooks/useSocketNotifications";

interface NotificationsContextType {
  notificaciones: Notificacion[];
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
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

  // Integrar WebSocket
  useSocketNotificaciones((noti: Notificacion) => {
    setNotificaciones((prev) => {
      if (prev.some((n) => n.id === noti.id)) {
        console.log("Notificación duplicada recibida por WebSocket:", noti); // Depuración
        return prev;
      }
      console.log("Nueva notificación recibida por WebSocket:", noti); // Depuración
      return [noti, ...prev];
    });
  });

  const marcarLeida = async (id: number) => {
    // Actualización optimista
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      await marcarComoLeida(id);
      console.log("Notificación marcada como leída en el backend:", id); // Depuración
    } catch (err) {
      console.error("Error al marcar como leída:", err);
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
    // Actualización optimista
    setNotificaciones((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await marcarTodasComoLeidas();
      console.log("Todas las notificaciones marcadas como leídas en el backend"); // Depuración
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
      try {
        const data = await getNotificaciones();
        console.log("Notificaciones recargadas después de error:", data); // Depuración
        setNotificaciones(data);
      } catch (fetchErr) {
        console.error("Error al recargar notificaciones:", fetchErr);
      }
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notificaciones, marcarLeida, marcarTodasLeidas }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext debe usarse dentro de NotificationsProvider");
  }
  return context;
};
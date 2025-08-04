// hooks/useSocketNotificaciones.ts
import { useEffect, useRef } from "react";
import { Notificacion } from "../types";
import { useAuth } from "@/hooks/UseAuth";

const WS_URL = import.meta.env. REACT_APP_WS_URL || "ws://localhost:8000";
console.log("URL del WebSocket:", WS_URL);

export const useSocketNotificaciones = (onNotificacion: (noti: Notificacion) => void) => {
  const { user, token } = useAuth();
  const userId = user?.id || null;
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      console.warn("No se proporcionó userId o token para WebSocket");
      return;
    }

    const connectWebSocket = () => {
      socketRef.current = new WebSocket(`${WS_URL}/ws/notifications/${userId}/?token=${token}`);

      socketRef.current.onopen = () => {
        console.log(`WebSocket conectado para usuario ${userId}`);
        if (reconnectIntervalRef.current) {
          clearInterval(reconnectIntervalRef.current);
          reconnectIntervalRef.current = null;
        }
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          onNotificacion(data.notification);
        }
      };

      socketRef.current.onerror = (err) => {
        console.error("Error en WebSocket", err);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket desconectado");
        if (!reconnectIntervalRef.current) {
          reconnectIntervalRef.current = setInterval(() => {
            console.log("Intentando reconectar WebSocket...");
            connectWebSocket();
          }, 5000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, [userId, token, onNotificacion]);
};
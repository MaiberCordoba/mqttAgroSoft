interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const connectWebSocket = (
  onMessage: (data: WebSocketMessage) => void,
  onAlert?: (alert: WebSocketMessage) => void,
  onError?: (error: string) => void
) => {
  const socket = new WebSocket("ws://127.0.0.1:8000/ws/sensor/");

  socket.onopen = () => {
    console.log("✅ WebSocket conectado");
    socket.send(JSON.stringify({
      action: "register",
      device: "frontend"
    }));
  };

  socket.onmessage = (event) => {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      switch(data.type) {
        case "sensor.alert":
          onAlert?.(data);
          break;
        case "sensor.update":
        case "sensor.global_update":
          onMessage(data);
          break;
        case "error":
          onError?.(data.message);
          break;
        default:
          console.warn("Tipo de mensaje no manejado:", data.type);
      }
    } catch (error) {
      console.error("❌ Error al parsear JSON:", error);
      onError?.("Error al procesar los datos del sensor");
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Error en WebSocket:", error);
    onError?.("Error de conexión con el servidor");
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log("WebSocket cerrado limpiamente");
    } else {
      console.warn("⚠️ WebSocket cerrado abruptamente. Reconectando...");
      setTimeout(() => connectWebSocket(onMessage, onAlert, onError), 5000);
    }
  };

  return {
    close: () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    },
    send: (data: any) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.warn("WebSocket no está conectado. No se puede enviar mensaje.");
      }
    }
  };
};
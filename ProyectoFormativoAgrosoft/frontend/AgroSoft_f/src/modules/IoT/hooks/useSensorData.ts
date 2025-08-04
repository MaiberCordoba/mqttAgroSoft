import { useEffect, useState } from "react";

function useSensorData(sensorId: string) {
  const [sensorData, setSensorData] = useState({ valor: 0, alerta: "" });

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/sensor/${sensorId}/`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData({ valor: data.valor, alerta: data.alerta || "" });
      } catch (error) {
        console.error("❌ Error al recibir datos:", error);
      }
    };

    ws.onerror = () => console.warn("⚠️ WebSocket error");
    ws.onclose = () => console.warn("⚠️ WebSocket cerrado");

    return () => ws.close();
  }, [sensorId]);

  return sensorData;
}

export default useSensorData;
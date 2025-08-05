import { useEffect, useState, useCallback, useRef } from "react";
import mqtt from "mqtt";
import { Thermometer, Droplets, Sun, Volume2, LandPlot } from "lucide-react";
import '../css/mqtt.css';

// No usamos variable global para evitar problemas de estado persistente
interface SensorCardsProps {
  onUpdate: (data: {
    temp: string;
    humidity: string;
    luminosity: string;
    soilMoisture: string;
    sound: string;
  }) => void;
}

export const SensorCards = ({ onUpdate }: SensorCardsProps) => {
  const [temp, setTemp] = useState<string>("--");
  const [humidity, setHumidity] = useState<string>("--");
  const [luminosity, setLuminosity] = useState<string>("--");
  const [soilMoisture, setSoilMoisture] = useState<string>("--");
  const [sound, setSound] = useState<string>("--");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [stats, setStats] = useState({
    temp: { min: Infinity, max: -Infinity, avg: 0, count: 0, total: 0 },
    humidity: { min: Infinity, max: -Infinity, avg: 0, count: 0, total: 0 },
    luminosity: { min: Infinity, max: -Infinity, avg: 0, count: 0, total: 0 },
    soilMoisture: { min: Infinity, max: -Infinity, avg: 0, count: 0, total: 0 },
    sound: { min: Infinity, max: -Infinity, avg: 0, count: 0, total: 0 },
  });

  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const valuesRef = useRef({ temp, humidity, luminosity, soilMoisture, sound });

  const formatStat = (value: number, fallback: string = "--"): string => {
    if (value === Infinity || value === -Infinity || isNaN(value)) {
      return fallback;
    }
    return value.toFixed(2);
  };

  const updateStats = useCallback((sensor: keyof typeof stats, value: number) => {
    setStats((prev) => {
      const current = prev[sensor];
      const newMin = Math.min(current.min, value);
      const newMax = Math.max(current.max, value);
      const newTotal = current.total + value;
      const newCount = current.count + 1;
      const newAvg = newTotal / newCount;

      return {
        ...prev,
        [sensor]: {
          min: newMin,
          max: newMax,
          avg: newAvg,
          total: newTotal,
          count: newCount,
        },
      };
    });
  }, []);

  const handleMessage = useCallback(
    (topic: string, message: Buffer) => {
      const value = message.toString();
      console.log(`Mensaje recibido en ${topic}: ${value}`); // Depuración
      switch (topic) {
        case "karensensors/dht22/temperature":
          setTemp(value);
          const tempNum = parseFloat(value);
          if (!isNaN(tempNum)) updateStats("temp", tempNum);
          break;
        case "karensensors/dht22/humidity":
          setHumidity(value);
          const humidityNum = parseFloat(value);
          if (!isNaN(humidityNum)) updateStats("humidity", humidityNum);
          break;
        case "karensensors/dht22/luminosity":
          setLuminosity(value);
          const luminosityNum = parseFloat(value);
          if (!isNaN(luminosityNum)) updateStats("luminosity", luminosityNum);
          break;
        case "karensensors/suelo/humedad":
          setSoilMoisture(value);
          const soilMoistureNum = parseFloat(value);
          if (!isNaN(soilMoistureNum)) updateStats("soilMoisture", soilMoistureNum);
          break;
        case "karensensors/sonido":
          setSound(value);
          const soundNum = parseFloat(value);
          if (!isNaN(soundNum)) updateStats("sound", soundNum);
          break;
      }
    },
    [updateStats]
  );

  const connectToBroker = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = mqtt.connect("ws://broker.hivemq.com:8000/mqtt", {
        protocolVersion: 5,
        reconnectPeriod: 1000, // Reconectar cada 1s
        clientId: `web-client-${Math.random().toString(16).slice(2, 10)}`,
      });

      clientRef.current.on("connect", () => {
        setIsConnected(true);
        console.log("Conectado al broker MQTT");
        clientRef.current?.subscribe("karensensors/#", { qos: 0 }, (err) => {
          if (!err) console.log("Suscripción exitosa a karensensors/#");
          else console.error("Error en suscripción:", err);
        });
      });

      clientRef.current.on("message", handleMessage);
      clientRef.current.on("error", (err) => {
        console.error("Error MQTT:", err);
        setIsConnected(false);
      });
      clientRef.current.on("reconnect", () => {
        console.log("Reconectando al broker...");
        setIsConnected(false);
      });
      clientRef.current.on("offline", () => {
        console.log("Cliente MQTT offline");
        setIsConnected(false);
      });
    }
  }, [handleMessage]);

  useEffect(() => {
    // Recuperar datos guardados
    const savedData = localStorage.getItem("sensorData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setTemp(data.temp || "--");
      setHumidity(data.humidity || "--");
      setLuminosity(data.luminosity || "--");
      setSoilMoisture(data.soilMoisture || "--");
      setSound(data.sound || "--");
    }

    // Conectar al broker
    connectToBroker();

    // Limpieza al desmontar el componente
    return () => {
      if (clientRef.current) {
        clientRef.current.off("message", handleMessage);
        clientRef.current.end(); // Cerrar conexión
        clientRef.current = null;
      }
    };
  }, [connectToBroker, handleMessage]);

  useEffect(() => {
    valuesRef.current = { temp, humidity, luminosity, soilMoisture, sound };
    localStorage.setItem("sensorData", JSON.stringify(valuesRef.current));
    onUpdate(valuesRef.current);
  }, [temp, humidity, luminosity, soilMoisture, sound, onUpdate]);

  return (
    <div className="sensor-dashboard p-4 max-w-7xl mx-auto">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Sensores</h1>
        <div className="connection-status flex items-center">
          <span className="mr-2 text-sm text-gray-600">
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
        </div>
      </div>

      <div className="sensor-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="card bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-[1.02]">
          <div className="icon-bg bg-blue-100 p-3 rounded-full mb-3">
            <Thermometer size={32} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Temperatura</h3>
          <p className="text-3xl font-bold text-gray-900 mb-3">{temp} °C</p>
          <div className="stats w-full mt-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
            <div className="stat-row flex justify-between py-1">
              <span>Mínimo:</span>
              <span className="font-medium">{formatStat(stats.temp.min)} °C</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Máximo:</span>
              <span className="font-medium">{formatStat(stats.temp.max)} °C</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Promedio:</span>
              <span className="font-medium">{formatStat(stats.temp.avg)} °C</span>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-[1.02]">
          <div className="icon-bg bg-green-100 p-3 rounded-full mb-3">
            <Droplets size={32} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Humedad Ambiente</h3>
          <p className="text-3xl font-bold text-gray-900 mb-3">{humidity} %</p>
          <div className="stats w-full mt-2 text-sm text-gray-600 bg-green-50 rounded-lg p-3">
            <div className="stat-row flex justify-between py-1">
              <span>Mínimo:</span>
              <span className="font-medium">{formatStat(stats.humidity.min)} %</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Máximo:</span>
              <span className="font-medium">{formatStat(stats.humidity.max)} %</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Promedio:</span>
              <span className="font-medium">{formatStat(stats.humidity.avg)} %</span>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-[1.02]">
          <div className="icon-bg bg-yellow-100 p-3 rounded-full mb-3">
            <Sun size={32} className="text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Luminosidad</h3>
          <p className="text-3xl font-bold text-gray-900 mb-3">{luminosity} lx</p>
          <div className="stats w-full mt-2 text-sm text-gray-600 bg-yellow-50 rounded-lg p-3">
            <div className="stat-row flex justify-between py-1">
              <span>Mínimo:</span>
              <span className="font-medium">{formatStat(stats.luminosity.min)} lx</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Máximo:</span>
              <span className="font-medium">{formatStat(stats.luminosity.max)} lx</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Promedio:</span>
              <span className="font-medium">{formatStat(stats.luminosity.avg)} lx</span>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-[1.02]">
          <div className="icon-bg bg-amber-100 p-3 rounded-full mb-3">
            <LandPlot size={32} className="text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Humedad Suelo</h3>
          <p className="text-3xl font-bold text-gray-900 mb-3">{soilMoisture} %</p>
          <div className="stats w-full mt-2 text-sm text-gray-600 bg-amber-50 rounded-lg p-3">
            <div className="stat-row flex justify-between py-1">
              <span>Mínimo:</span>
              <span className="font-medium">{formatStat(stats.soilMoisture.min)} %</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Máximo:</span>
              <span className="font-medium">{formatStat(stats.soilMoisture.max)} %</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Promedio:</span>
              <span className="font-medium">{formatStat(stats.soilMoisture.avg)} %</span>
            </div>
          </div>
        </div>

        <div className="card bg-white rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-[1.02]">
          <div className="icon-bg bg-purple-100 p-3 rounded-full mb-3">
            <Volume2 size={32} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">Sonido</h3>
          <p className="text-3xl font-bold text-gray-900 mb-3">{sound}</p>
          <div className="stats w-full mt-2 text-sm text-gray-600 bg-purple-50 rounded-lg p-3">
            <div className="stat-row flex justify-between py-1">
              <span>Mínimo:</span>
              <span className="font-medium">{formatStat(stats.sound.min)}</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Máximo:</span>
              <span className="font-medium">{formatStat(stats.sound.max)}</span>
            </div>
            <div className="stat-row flex justify-between py-1">
              <span>Promedio:</span>
              <span className="font-medium">{formatStat(stats.sound.avg)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
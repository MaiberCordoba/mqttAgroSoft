import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectItem, Input } from "@heroui/react";
import {
  WiStrongWind,
  WiThermometer,
  WiDayCloudy,
  WiRaindrop,
  WiHumidity,
  WiRain, 
} from "react-icons/wi";
import { BiTestTube } from "react-icons/bi";
import SensorCard from "../components/SensorCard";
import { SensorLista } from "../components/sensor/SensorListar";
import { addToast } from "@heroui/toast";
import '../components/css/card.css'


type SensorData = {
  tipo: string;
  valor: number;
  umbral_minimo: number | null;
  umbral_maximo: number | null;
  [key: string]: any;
};


type Lote = {
  id: number;
  nombre: string;
};

type Era = {
  id: number;
  nombre: string;
  fk_lote_id: number;
};


const SENSOR_TYPES = [
  { key: "VIE", label: "Viento" },
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Luz Solar" },
  { key: "HUM_T", label: "Humedad del Suelo" },
  { key: "HUM_A", label: "Humedad Ambiente" },
  { key: "LLUVIA", label: "Lluvia" },
  { key: "PH", label: "pH" },
];

const SENSOR_UNITS: Record<string, string> = {
  VIE: "km/h",
  TEM: "°C",
  LUM: "lux",
  HUM_T: "%",
  HUM_A: "%",
  LLUVIA: "mm",
  PH: "",
};

export default function IoTPages() {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [eras, setEras] = useState<Era[]>([]);
  const [filters, setFilters] = useState({
    loteId: "",
    eraId: "",
    hours: "24"
  });
  const [sensorAverages, setSensorAverages] = useState<Record<string, any>>({});
  const [loadingAverages, setLoadingAverages] = useState(false);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {

  fetch('http://127.0.0.1:8000/api/lote/')
    .then(res => res.json())
    .then(data => setLotes(data));

  fetch('http://127.0.0.1:8000/api/eras/')
    .then(res => res.json())
    .then(data => setEras(data));
}, []);

  const fetchSensorAverages = async () => {
    setLoadingAverages(true);
    try {
      const params = new URLSearchParams();
      if (filters.loteId) params.append('lote_id', filters.loteId);
      if (filters.eraId) params.append('era_id', filters.eraId);
      params.append('hours', filters.hours);

      const response = await fetch(`http://127.0.0.1:8000/api/sensor/averages/?${params.toString()}`);
      if (!response.ok) throw new Error("Error al obtener promedios");
      
      const data = await response.json();
      const transformedData: Record<string, any> = {};
      
      Object.keys(data).forEach(key => {
        transformedData[key] = {
          ...data[key],
          unit: SENSOR_UNITS[key] || '',
          average: data[key].average || 0,
          min_threshold: data[key].min_threshold || null,
          max_threshold: data[key].max_threshold || null,
          count: data[key].count || 0
        };
      });
      
      setSensorAverages(transformedData);
    } catch (error) {
      console.error("Error al obtener promedios:", error);
      addToast({
        title: "Error",
        description: "No se pudieron cargar los promedios de los sensores",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setLoadingAverages(false);
    }
  };

  useEffect(() => {
    fetchSensorAverages();
  }, [filters.loteId, filters.eraId, filters.hours]);


  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    }
    return false;
  };

  const showAlertToast = (sensor: SensorData) => {
    const sensorType = SENSOR_TYPES.find(st => st.key === sensor.tipo);
    const sensorName = sensorType?.label || sensor.tipo;
    const unit = SENSOR_UNITS[sensor.tipo] || "";

    let message = "";
    if (sensor.valor < (sensor.umbral_minimo || 0)) {
      message = `${sensorName} por debajo del mínimo (${sensor.umbral_minimo}${unit}). Valor actual: ${sensor.valor}${unit}`;
    } else {
      message = `${sensorName} por encima del máximo (${sensor.umbral_maximo}${unit}). Valor actual: ${sensor.valor}${unit}`;
    }

    addToast({
      title: "Alerta de Sensor",
      description: message,
      variant: "flat",
      color: "danger",

    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/sensor/?limit=100`);
        if (!response.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await response.json();

        if (Array.isArray(sensorsData)) {
          sensorsData.forEach(sensor => {
            if (checkForAlerts(sensor)) {
              showAlertToast(sensor);
            }
          });
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
    fetchSensorAverages();
  }, []);

  const sensoresList = [
    { id: "viento", tipo: "VIE", title: "Viento", icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }} /> },
    { id: "temperatura", tipo: "TEM", title: "Temperatura", icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} /> },
    { id: "luzSolar", tipo: "LUM", title: "Luz Solar", icon: <WiDayCloudy size={32} style={{ color: "#F1C40F" }} /> },
    { id: "humedad", tipo: "HUM_T", title: "Humedad", icon: <WiRaindrop size={32} style={{ color: "#3498DB" }} /> },
    { id: "humedadAmbiente", tipo: "HUM_A", title: "H. Ambiente", icon: <WiHumidity size={32} style={{ color: "#76D7C4" }} /> },
    { id: "lluvia", tipo: "LLUVIA", title: "Lluvia", icon: <WiRain size={32} style={{ color: "#2980B9" }} /> },
    { id: "ph", tipo: "PH", title: "pH", icon: <BiTestTube size={28} style={{ color: "#8E44AD" }} /> },
  ];

  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 justify-center items-center w-full max-w-6xl mx-auto">
    <div className="col-span-full">
      <div className="h-8" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-6xl mx-auto px-4 mb-4 gap-4">
        <h2 className="text-2xl font-bold text-blue-800 text-center md:text-left w-full md:w-auto">
          <strong>Promedio de sensores</strong>
        </h2>

      </div>
      <div className="h-8" />
      <div className="col-span-full flex flex-row gap-4 w-full max-w-3xl mx-auto px-4 items-center justify-center">
        <Select
          label=""
          placeholder="Filtrar sensores por lote"
          selectedKeys={filters.loteId ? [filters.loteId] : []}
          onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setFilters(prev => ({...prev, loteId: selected || "", eraId: ""}));
          }}
          size="md"
          className="min-w-[180px] text-base"
        >
          {lotes.map(lote => (
        <SelectItem key={String(lote.id)} className="text-base truncate">
          {lote.nombre}
        </SelectItem>
          ))}
        </Select>

        <Select
          label=""
          placeholder="Filtrar sensores por era"
          selectedKeys={filters.eraId ? [filters.eraId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setFilters(prev => ({...prev, eraId: selected || ""}));
          }}
          size="md"
          className="min-w-[150px] text-base"
        >
          {eras.map(era => (
            <SelectItem key={String(era.id)} className="text-base">
              {era.nombre || `Era ${era.id}`}
            </SelectItem>
          ))}
        </Select>

        <Select
          label=""
          placeholder="Periodo"
          selectedKeys={[filters.hours]}
          onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        setFilters(prev => ({...prev, hours: selected || "24"}));
          }}
          size="md"
          className="min-w-[180px] text-base"
        >
          <SelectItem key="1" className="text-base">1 hora</SelectItem>
          <SelectItem key="6" className="text-base">6 horas</SelectItem>
          <SelectItem key="24" className="text-base">24 horas</SelectItem>
          <SelectItem key="168" className="text-base">1 semana</SelectItem>
          <SelectItem key="720" className="text-base">1 mes</SelectItem>
          <SelectItem key="4320" className="text-base">1 año</SelectItem>
        </Select>

        <Input
          placeholder="Buscar Sensor"
          value={searchId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
          size="sm"
        />
      </div>
      <div className="h-8" />
      <div className="overflow-x-hidden w-full mt-4 relative">
        <div className="auto-scroll-container flex gap-4 pb-4 px-4">
          {[...sensoresFiltrados, ...sensoresFiltrados].map((sensor, index) => {
            const averageData = sensorAverages[sensor.tipo] || {};
            const hasData = averageData.average !== undefined;
            const isAlert = averageData.min_threshold !== undefined && 
                         averageData.max_threshold !== undefined &&
                         (averageData.average < averageData.min_threshold || 
                          averageData.average > averageData.max_threshold);
            
            return (
              <div 
                key={`${sensor.id}-${index}`}
                className="flex-shrink-0 scale-95 hover:scale-97 transition-transform"
              >
                <SensorCard
                  icon={sensor.icon}
                  title={sensor.title}
                  value={
                    loadingAverages
                      ? "Calculando..."
                      : hasData
                        ? `${averageData.average.toFixed(2)} ${averageData.unit}`
                        : "Sin datos"
                  }
                  subtitle={
                    hasData
                      ? `Mín: ${averageData.min_threshold?.toFixed(2) || 'N/A'} | Máx: ${averageData.max_threshold?.toFixed(2) || 'N/A'}`
                      : "No hay datos"
                  }
                  alert={isAlert}
                  onClick={() => navigate(`/sensores/${sensor.id}`)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <div className="h-8" />
    <div className="col-span-full mt-6 flex flex-col items-center">
        <div className="w-full mt-4 animate-slideDown">
          <SensorLista />
        </div>

    </div>
  </div>
);
}
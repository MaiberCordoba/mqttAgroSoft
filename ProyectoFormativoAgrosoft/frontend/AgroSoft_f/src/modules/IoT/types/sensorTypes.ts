export interface SensorData {
  id?: number;
  fk_lote_id?: number | null;
  fk_eras_id?: number | null;
  fk_lote?: number | null;
  fk_eras?: number | null;
  fecha: string;
  tipo: "TEM" | "LUM" | "HUM_A" | "VIE" | "HUM_T" | "PH"|"LLUVIA";
  valor: number;
  umbral_minimo?: number | null;
  umbral_maximo?: number | null;
}

export const SENSOR_TYPES = [
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Iluminación" },
  { key: "HUM_A", label: "Humedad Ambiental" },
  { key: "VIE", label: "Velocidad del Viento" },
  { key: "HUM_T", label: "Humedad del Terreno" },
  { key: "PH", label: "Nivel de PH" },
  { key: "LLUVIA", label: "Lluvia" }
];

export interface SensorConExtras extends SensorData {
  unidad: string;
  alerta: boolean;
  locationName?: string;
}

// Colores para cada tipo de sensor
export const SENSOR_COLORS: Record<string, string> = {
  TEM: "#8884d8",
  LUM: "#ffc658",
  HUM_A: "#82ca9d",
  VIE: "#ff8042",
  HUM_T: "#0088FE",
  PH: "#00C49F",
  LLUVIA: "#FFBB28"
};

// Unidades para cada sensor
export const SENSOR_UNITS: Record<string, string> = {
  TEM: "°C",
  LUM: "lux",
  HUM_A: "%",
  VIE: "km/h",
  HUM_T: "%",
  PH: "pH",
  LLUVIA: "mm"
};
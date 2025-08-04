export interface Sensor {
    id?: number;
    fk_lote?: number | null;
    fk_eras?: number | null;
    fecha?: string;
    tipo: "TEM" | "LUM" | "HUM_A" | "VIE" | "HUM_T" | "PH";
    valor: number;
  }
  
  export const SENSOR_TYPES = {
    TEM: "Temperatura",
    LUM: "Iluminación",
    HUM_A: "Humedad Ambiental",
    VIE: "Velocidad del Viento",
    HUM_T: "Humedad del Terreno",
    PH: "Nivel de PH",
  };
  
export interface User {
  id: number;
  identificacion: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  correoElectronico: string;
  rol: string;
  admin: boolean;
  password?: string;
  estado: string;
}

export interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

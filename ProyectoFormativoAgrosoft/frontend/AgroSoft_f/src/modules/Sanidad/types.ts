export interface TiposEspecie {
  id: number;
  nombre: string;
  descripcion: string;
  img: string;
}

export interface Especies {
  id: number;
  tiposEspecie: TiposEspecie;
  nombre: string;
  descripcion: string;
  img: string;
  tiempocrecimiento: string;
  fk_tipoespecie: number;
}

export interface Cultivo {
  id: number;
  especies: Especies;
  nombre: string;
  activo: boolean;
  fk_Especie: number;
}

export interface Semillero {
  id: number;
  cultivo: Cultivo;
  unidades: number;
  fechasiembra: string;
  fechaestimada: string;
  fk_Cultivo: number;
}

export interface Lote {
  id: number;
  nombre: string;
  descripcion: string;
  latI1: number;
  longI1: number;
  latS1: number;
  longS1: number;
  latI2: number;
  longI2: number;
  latS2: number;
  longS2: number;
  estado: boolean;
}

export interface Eras {
  id: number;
  Lote: Lote;
  tipo: string;
  latI1: number;
  longI1: number;
  latS1: number;
  longS1: number;
  latI2: number;
  longI2: number;
  latS2: number;
  longS2: number;
  fk_lote: number;
}

export interface Plantaciones {
  id: number;
  semillero: Semillero;
  cultivo: Cultivo;
  eras: Eras;
  unidades: number;
  fechaSiembra: string;
  creado: string;
  fk_semillero: number;
  fk_Cultivo: number;
  fk_Era: number;
}

export interface TiposAfecciones {
  id: number;
  nombre: string;
  descripcion: string;
  img: string;
}

export interface Afecciones {
  id: number;
  tipoPlaga: TiposAfecciones;
  nombre: string;
  descripcion: string;
  img: string;
  fk_Tipo: number;
}

export enum EstadoAfeccion {
  ST = "Detectado",
  EC = "EnTratamiento",
  EL = "Erradicado",
}

export interface AfeccionesCultivo {
  id: number;
  plagas: Afecciones;
  plantaciones: Plantaciones;
  fechaEncuentro: string;
  estado: keyof typeof EstadoAfeccion;
  fk_Plantacion: number;
  fk_Plaga: number;
}

export interface TipoControl {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Controles {
  id: number;
  fk_Afeccion?: number;
  fk_TipoControl?: number;
  fechaControl: string;
  descripcion: string;
  fk_Usuario?: number;
  usuario?: {
    id: number;
    nombre: string;
    apellidos: string;
  };
  afeccion: Afecciones;
}

export interface ControlDetails {
  id: number;
  descripcion: string;
  fechaControl: string;
  tipoControl: TipoControl;
  afeccionCultivo: AfeccionesCultivo & {
    plaga: Afecciones;
  };
}

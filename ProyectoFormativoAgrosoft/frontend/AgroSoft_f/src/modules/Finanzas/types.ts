//Creacion de los tipos de datos
import { Controles } from "../Sanidad/types";
import { Cultivo, Lotes, Plantaciones } from "../Trazabilidad/types";
import { User } from "../Users/types";

export interface ResumenEconomicoListado {
  id: number;
  nombre: string;
  cultivo_id: number;
  nombre_especie: string | null;
  unidades: number;
  fecha_siembra: string | null;
  costo_insumos: number;
  total_mano_obra: number;
  total_costos: number;
  total_ventas: number;
  beneficio: number;
  relacion_beneficio_costo: number;
}

export interface DetalleActividad {
  tipo_actividad: string | null;
  responsable: string | null;
  fecha: string;
  tiempo_total: number;
  costo_mano_obra: number;
  insumos: Insumo[];
  total_insumos_actividad: number;
}

export interface DetalleControl {
  descripcion: string;
  fecha: string;
  tipo_control: string | null;
  plaga: string | null;
  tipo_plaga: string | null;
  tiempo_total: number;
  costo_mano_obra: number;
  insumos: Insumo[];
  total_insumos_control: number;
}

export interface DetalleCosecha {
  cantidad: number;
  unidad: string | null;
  fecha: string;
}

export interface DetalleVenta {
  cantidad: number;
  unidad: string | null;
  fecha: string;
  valor_total: number;
}

export interface Insumo {
  nombre: string;
  cantidad: number;
  unidad: string | null;
  costo: number;
}

export interface DetalleResumenEconomico {
  id: number;
  nombre: string | null;
  nombre_especie: string | null;
  fecha_siembra: string | null;
  unidades: number;
  total_insumos: number;
  total_mano_obra: number;
  total_depreciacion: number;
  total_costos: number;
  total_ventas: number;
  beneficio: number;
  relacion_beneficio_costo: number;
  detalle: {
    actividades: {
      total: number;
      actividades_detalladas: any[];
    };
    controles: {
      total: number;
      controles_detallados: any[];
    };
    cosechas: {
      total: number;
      cosechas_detalladas: any[];
    };
    ventas: {
      total: number;
      ventas_detalladas: any[];
    };
  };
}

export interface Actividades {
  id: number;
  fk_Cultivo?: number;
  cultivo?: Cultivo;
  fk_Usuario?: number;
  usuario?: User;
  fk_TipoActividad: number;
  tipoActividad: TipoActividad;
  fk_Plantacion: number;
  plantacion: Plantaciones;
  titulo: string;
  descripcion: string;
  fecha?: string;
  estado?: "AS" | "CO" | "CA";
}

export interface Cosechas {
  id: number;
  fk_Plantacion?: number;
  plantacion?: Plantaciones;
  fk_UnidadMedida: number;
  cantidad: number;
  valorTotal: number;
  precioUnidad: number;
  unidadMedida: UnidadesMedida;
  cantidadTotal: number;
  fecha: string;
  valorGramo: number;
}

export interface Desechos {
  id: number;
  fk_Plantacion?: number;
  plantacion?: Plantaciones;
  fk_TipoDesecho?: number;
  tipoDesecho?: TiposDesechos;
  nombre: string;
  descripcion: string;
}

export interface Herramientas {
  id: number;
  fk_Lote?: number;
  lote?: Lotes;
  nombre: string;
  descripcion: string;
  unidades: number;
  precio: number;
  valorTotal: number;
}

export interface Insumos {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  compuestoActivo: string;
  contenido: number;
  fichaTecnica: string;
  unidades: number;
  fk_UnidadMedida: number;
  unidadMedida: UnidadesMedida;
  totalGramos: number;
  cantidadGramos: number;
  valorTotalInsumos: number;
}

export interface MovimientoInventario {
  id: number;
  tipo: "entrada" | "salida";
  unidades: number;
  fk_Insumo?: number;
  insumo?: Insumos;
  fk_UsoInsumo?: number;
  usoInsumo: UsosInsumos;
  fk_Herramienta?: number;
  herramienta: Herramientas;
  fk_UsoHerramienta?: number;
  usoHerramienta: UsosHerramientas;
  unidad_medida?: string;
  fecha?: string;
  usuario?: {
    id: number;
    nombre?: string;
    apellidos?: string;
    rol?: string;
  };
  /* fk_Cosecha : number,
    cosecha : Cosechas, */
}

export interface Salarios {
  id: number;
  nombre: string;
  monto: number;
  horas: number;
  monto_minutos: number;
  estado: "activo" | "inactivo";
}

export interface TiempoActividadControl {
  id: number;
  tiempo: number;
  valorTotal: number;
  fk_unidadTiempo: number;
  unidadTiempo: UnidadesTiempo;
  fk_actividad?: number;
  actividad?: Actividades;
  fk_control?: number;
  control?: Controles;
  fk_salario: number;
  salario: Salarios;
  fecha: string;
  estado_pago: "PENDIENTE" | "PAGADO";
  usuario: string;
}

export interface TipoActividad {
  id: number;
  nombre: string;
}

export interface TiposDesechos {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface UnidadesMedida {
  id: number;
  nombre: string;
  abreviatura: string;
  tipo: "MASA" | "VOLUMEN"; // Se usará "MASA" o "VOLUMEN"
  equivalenciabase: number;
}

export interface UnidadesTiempo {
  id: number;
  nombre: string;
  equivalenciaMinutos: number;
}

export interface UsosInsumos {
  id: number;
  fk_Insumo?: number;
  insumo?: Insumos;
  fk_Actividad?: number;
  actividad?: Actividades;
  fk_Control: number;
  control: Controles;
  cantidadProducto: number;
  fk_UnidadMedida: number;
  unidadMedida: UnidadesMedida;
  costoUsoInsumo: number;
}

export interface UsosHerramientas {
  id: number;
  fk_Herramienta?: number;
  herramienta?: Herramientas;
  fk_Actividad?: number;
  actividad?: Actividades;
  fk_Control: number;
  control?: Controles;
  unidades: number;
}

export interface Ventas {
  id: number;
  fk_Cosecha?: number;
  cosecha?: Cosechas;
  fecha: string;
  fk_UnidadMedida: number;
  unidadMedida: UnidadesMedida;
  cantidad: number;
  descuento?: number;
  valorTotal: number;
}

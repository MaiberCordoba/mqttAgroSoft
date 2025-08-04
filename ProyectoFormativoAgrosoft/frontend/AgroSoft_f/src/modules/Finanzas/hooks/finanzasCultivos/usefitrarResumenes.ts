// hooks/useFiltrarResumenes.ts
import { ResumenEconomicoListado } from "../../types";
import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";

export const useFiltrarResumenes = (
  resumenes: ResumenEconomicoListado[],
  tipoEspecieId: number | null,
  especieId: number | null,
  fechaInicio: string | null,
  fechaFin: string | null
) => {
  const { data: especies } = useGetEspecies();

  const resumenesFiltrados = resumenes.filter((resumen) => {
    // 1. Filtro por tipo de especie y especie
    let cumpleEspecie = true;
    if (tipoEspecieId || especieId) {
      const especie = especies?.find(e => e.nombre === resumen.nombre_especie);
      
      if (tipoEspecieId && (!especie || especie.fk_tipoespecie !== tipoEspecieId)) {
        cumpleEspecie = false;
      }
      
      if (especieId && (!especie || especie.id !== especieId)) {
        cumpleEspecie = false;
      }
    }

    // 2. Filtro por fecha de siembra
    let cumpleFecha = true;
    if (fechaInicio || fechaFin) {
      if (!resumen.fecha_siembra) return false; // Si no tiene fecha, excluir
      
      const fechaSiembra = new Date(resumen.fecha_siembra);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;

      // Ajustar fecha fin para incluir todo el día
      if (fin) fin.setHours(23, 59, 59, 999);

      cumpleFecha = (!inicio || fechaSiembra >= inicio) && 
                   (!fin || fechaSiembra <= fin);
    }

    return cumpleEspecie && cumpleFecha;
  });

  return resumenesFiltrados;
};
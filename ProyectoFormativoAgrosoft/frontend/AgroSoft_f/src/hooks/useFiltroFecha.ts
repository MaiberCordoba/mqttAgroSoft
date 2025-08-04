import { useState, useMemo } from 'react';

interface FiltroFechaProps {
  fechaInicio: string | null;
  fechaFin: string | null;
}

export const useFiltroFecha = <T extends { fecha: string }>(datos: T[]) => {
  const [filtroFecha, setFiltroFecha] = useState<FiltroFechaProps>({
    fechaInicio: null,
    fechaFin: null
  });

  const datosFiltrados = useMemo(() => {
    if (!filtroFecha.fechaInicio && !filtroFecha.fechaFin) return datos;

    return datos.filter(item => {
      const fechaItem = new Date(item.fecha);
      
      // Verificar fecha inicio
      const cumpleInicio = !filtroFecha.fechaInicio || 
                         fechaItem >= new Date(filtroFecha.fechaInicio);
      
      // Verificar fecha fin (agregamos un día para incluir el día completo)
      const cumpleFin = !filtroFecha.fechaFin || 
                      fechaItem <= new Date(new Date(filtroFecha.fechaFin).setHours(23, 59, 59, 999));

      return cumpleInicio && cumpleFin;
    });
  }, [datos, filtroFecha]);

  const limpiarFiltros = () => {
    setFiltroFecha({
      fechaInicio: null,
      fechaFin: null
    });
  };

  return {
    filtroFecha,
    setFiltroFecha,
    datosFiltrados,
    limpiarFiltros
  };
};
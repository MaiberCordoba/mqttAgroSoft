import { useState, useMemo } from "react";

export const useFiltrado = <T extends { [key: string]: any }>(
  datos: T[],
  claveBusqueda: keyof T,
) => {
  const [valorFiltro, setValorFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<Set<string>>(new Set());

  const datosFiltrados = useMemo(() => {
    let filtrados = [...datos];

    // Filtro de búsqueda
    if (valorFiltro) {
      filtrados = filtrados.filter((item) =>
        String(item[claveBusqueda]).toLowerCase().includes(valorFiltro.toLowerCase()),
      );
    }

    // Filtro de estado
    if (filtroEstado.size > 0) {
      filtrados = filtrados.filter((item) => filtroEstado.has(item.estado));
    }

    return filtrados;
  }, [datos, valorFiltro, filtroEstado, claveBusqueda]);

  return {
    valorFiltro,
    setValorFiltro,
    filtroEstado,
    setFiltroEstado,
    datosFiltrados,
  };
};
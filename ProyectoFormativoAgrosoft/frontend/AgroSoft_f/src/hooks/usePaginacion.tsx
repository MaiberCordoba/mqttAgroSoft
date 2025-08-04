import { useState, useMemo } from "react";

export const usePaginacion = <T,>(datos: T[], filasPorPagina: number) => {
  const [paginaActual, setPaginaActual] = useState(1);

  // Calcular el número total de páginas
  const totalPaginas = Math.ceil(datos.length / filasPorPagina);

  // Obtener los datos de la página actual
  const datosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    return datos.slice(inicio, fin);
  }, [paginaActual, datos, filasPorPagina]);

  // Función para cambiar de página
  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return {
    paginaActual,
    setPaginaActual: cambiarPagina,
    totalPaginas,
    datosPaginados,
  };
};
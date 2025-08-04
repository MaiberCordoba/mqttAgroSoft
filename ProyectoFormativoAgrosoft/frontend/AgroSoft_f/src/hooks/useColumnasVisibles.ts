// hooks/useColumnasVisibles.ts
import { Selection } from "@heroui/react";
import { useState } from "react";

/**
 * Hook para manejar columnas visibles en tablas
 * @param initialColumns Columnas iniciales visibles (array de uids)
 * @returns {
 *   visibleColumns: Set de columnas visibles
 *   setVisibleColumns: Función para actualizar columnas visibles
 * }
 */
export const useColumnasVisibles = (initialColumns: string[]) => {
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialColumns));
  
  return {
    visibleColumns,
    setVisibleColumns
  };
};
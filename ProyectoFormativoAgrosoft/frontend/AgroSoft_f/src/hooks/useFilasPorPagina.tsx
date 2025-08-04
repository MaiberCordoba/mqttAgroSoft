import { useState } from "react";

export const useFilasPorPagina = (initialRowsPerPage: number = 5) => {
  const [filasPorPagina, setFilasPorPagina] = useState(initialRowsPerPage);

  const handleChangeFilasPorPagina = (value: number) => {
    setFilasPorPagina(value);
  };

  return {
    filasPorPagina,
    handleChangeFilasPorPagina,
  };
};
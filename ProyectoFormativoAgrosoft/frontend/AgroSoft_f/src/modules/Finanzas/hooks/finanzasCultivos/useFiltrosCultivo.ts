import { useState } from "react";

export const useFiltrosCultivos = () => {
  const [tipoEspecieId, setTipoEspecieId] = useState<number | null>(null);
  const [especieId, setEspecieId] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState<string | null>(null);

  const handleTipoEspecieChange = (id: number | null) => {
    setTipoEspecieId(id);
    setEspecieId(null); // Resetear especie cuando cambia el tipo
  };

  const handleEspecieChange = (id: number | null) => {
    setEspecieId(id);
  };

  const handleFechaChange = ({ fechaInicio, fechaFin }: { fechaInicio: string | null; fechaFin: string | null }) => {
    setFechaInicio(fechaInicio);
    setFechaFin(fechaFin);
  };

  const resetFiltros = () => {
    setTipoEspecieId(null);
    setEspecieId(null);
    setFechaInicio(null);
    setFechaFin(null);
  };

  return {
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin,
    handleTipoEspecieChange,
    handleEspecieChange,
    handleFechaChange,
    resetFiltros
  };
};
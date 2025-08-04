// hooks/useCultivoSelection.ts
import { useState } from "react";
import { useResumenEconomico } from "./useGetResumenEconomico";

export const useCultivoSelection = () => {
  const [selectedCultivoId, setSelectedCultivoId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usamos el hook existente para obtener el detalle completo
  const { data: cultivoDetalle } = useResumenEconomico(selectedCultivoId || 0);

  const handleSelectCultivo = (cultivoId: number) => {
    setSelectedCultivoId(cultivoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCultivoId(null), 300); // Esperar a que se cierre la animación
  };

  return {
    selectedCultivo: cultivoDetalle || null,
    isModalOpen,
    handleSelectCultivo,
    closeModal,
  };
};

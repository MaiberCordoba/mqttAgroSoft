import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Plantaciones } from "../../types";

export const useEliminarPlantaciones = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [PlantacionesEliminada, setPlantacionesEliminada] = useState<Plantaciones | null>(null);

  const handleEliminar = (Plantaciones: Plantaciones) => {
    setPlantacionesEliminada(Plantaciones);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    PlantacionesEliminada,
    handleEliminar,
    handleSuccess,
  };
};
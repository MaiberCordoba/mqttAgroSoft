import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Plantaciones } from "../../types";

export const useEditarPlantaciones = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [PlantacionesEditada, setPlantacionesEditada] = useState<Plantaciones | null>(null);

  const handleEditar = (Plantaciones: Plantaciones) => {
    setPlantacionesEditada(Plantaciones);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    PlantacionesEditada,
    handleEditar,
  };
};
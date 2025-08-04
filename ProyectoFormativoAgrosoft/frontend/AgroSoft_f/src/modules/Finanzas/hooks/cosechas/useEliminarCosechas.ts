import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cosechas } from "../../types";

export const useEliminarCosecha = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [cosechaEliminada, setCosechaEliminada] = useState<Cosechas | null>(null);

  const handleEliminar = (cosecha: Cosechas) => {
    setCosechaEliminada(cosecha);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    cosechaEliminada,
    handleEliminar,
    handleSuccess,
  };
};

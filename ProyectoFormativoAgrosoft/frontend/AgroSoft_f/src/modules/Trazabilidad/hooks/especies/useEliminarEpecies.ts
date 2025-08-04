import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Especies } from "../../types";

export const useEliminarEspecies = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [EspeciesEliminada, setEspeciesEliminada] = useState<Especies | null>(null);

  const handleEliminar = (Especies: Especies) => {
    setEspeciesEliminada(Especies);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    EspeciesEliminada,
    handleEliminar,
    handleSuccess,
  };
};
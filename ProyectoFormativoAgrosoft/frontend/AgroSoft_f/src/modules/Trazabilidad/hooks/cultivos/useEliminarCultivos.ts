import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cultivo } from "../../types";

export const useEliminarCultivos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [CultivosEliminada, setCultivosEliminada] = useState<Cultivo | null>(null);

  const handleEliminar = (Cultivos: Cultivo) => {
    setCultivosEliminada(Cultivos);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    CultivosEliminada,
    handleEliminar,
    handleSuccess,
  };
};
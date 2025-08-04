import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { AfeccionesCultivo } from "../../types";

export const useEliminarAfeccionCultivo = () => { 
  const { isOpen, openModal, closeModal } = UseModal();
  const [afeccionCultivoEliminada, setAfeccionCultivoEliminada] = useState<AfeccionesCultivo | null>(null); // Cambié el nombre de la variable y el tipo

  const handleEliminar = (afeccionCultivo: AfeccionesCultivo) => { 
    setAfeccionCultivoEliminada(afeccionCultivo);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    afeccionCultivoEliminada, 
    handleEliminar,
    handleSuccess,
  };
};

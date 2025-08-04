import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { AfeccionesCultivo } from "../../types"; 

export const useEditarAfeccionCultivo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [afeccionCultivoEditada, setAfeccionCultivoEditada] = useState<AfeccionesCultivo | null>(null); // Cambié el nombre de la variable

  const handleEditar = (afeccionCultivo: AfeccionesCultivo) => { 
    setAfeccionCultivoEditada(afeccionCultivo);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    afeccionCultivoEditada, 
    handleEditar,
  };
};


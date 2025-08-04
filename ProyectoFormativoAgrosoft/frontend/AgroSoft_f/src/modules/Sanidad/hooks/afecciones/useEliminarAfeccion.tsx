import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Afecciones } from "../../types";

export const useEliminarAfeccion = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [afeccionEliminada, setAfeccionEliminada] = useState<Afecciones | null>(null);

  const handleEliminar = (afeccion: Afecciones) => {
    setAfeccionEliminada(afeccion);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    afeccionEliminada,
    handleEliminar,
    handleSuccess,
  };
};
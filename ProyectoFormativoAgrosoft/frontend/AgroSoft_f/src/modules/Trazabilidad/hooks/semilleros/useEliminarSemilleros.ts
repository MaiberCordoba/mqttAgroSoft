import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Semillero } from "../../types";

export const useEliminarSemilleros = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [SemillerosEliminada, setSemillerosEliminada] = useState<Semillero | null>(null);

  const handleEliminar = (Semilleros: Semillero) => {
    setSemillerosEliminada(Semilleros);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    SemillerosEliminada,
    handleEliminar,
    handleSuccess,
  };
};
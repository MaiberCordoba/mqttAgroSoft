import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposDesechos } from "../../types";

export const useEliminarTiposDesechos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tiposDesechosEliminada, setTiposDesechosEliminada] = useState<TiposDesechos | null>(null);

  const handleEliminar = (tipoDesecho: TiposDesechos) => {
    setTiposDesechosEliminada(tipoDesecho);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    tiposDesechosEliminada,
    handleEliminar,
    handleSuccess,
  };
};
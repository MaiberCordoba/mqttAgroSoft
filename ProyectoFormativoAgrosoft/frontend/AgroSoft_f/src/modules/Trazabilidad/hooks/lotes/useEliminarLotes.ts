import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Lotes } from "../../types";

export const useEliminarLotes = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [LotesEliminada, setLotesEliminada] = useState<Lotes | null>(null);

  const handleEliminar = (Lotes: Lotes) => {
    setLotesEliminada(Lotes);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    LotesEliminada,
    handleEliminar,
    handleSuccess,
  };
};
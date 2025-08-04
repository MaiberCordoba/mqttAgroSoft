import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Lotes } from "../../types";

export const useEditarLotes = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [LotesEditada, setLotesEditada] = useState<Lotes | null>(null);

  const handleEditar = (Lotes: Lotes) => {
    setLotesEditada(Lotes);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    LotesEditada,
    handleEditar,
  };
};
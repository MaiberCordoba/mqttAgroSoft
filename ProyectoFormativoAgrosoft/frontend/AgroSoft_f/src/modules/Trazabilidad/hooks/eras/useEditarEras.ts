import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Eras } from "../../types";

export const useEditarEras = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [ErasEditada, setErasEditada] = useState<Eras | null>(null);

  const handleEditar = (Eras: Eras) => {
    setErasEditada(Eras);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    ErasEditada,
    handleEditar,
  };
};
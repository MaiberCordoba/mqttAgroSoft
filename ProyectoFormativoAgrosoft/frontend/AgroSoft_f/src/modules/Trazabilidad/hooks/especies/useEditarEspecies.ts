import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Especies } from "../../types";

export const useEditarEspecies = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [EspeciesEditada, setEspeciesEditada] = useState<Especies | null>(null);

  const handleEditar = (Especies: Especies) => {
    setEspeciesEditada(Especies);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    EspeciesEditada,
    handleEditar,
  };
};
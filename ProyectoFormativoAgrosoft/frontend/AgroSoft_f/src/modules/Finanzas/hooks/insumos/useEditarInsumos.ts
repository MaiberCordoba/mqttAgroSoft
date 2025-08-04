import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Insumos } from "../../types";

export const useEditarInsumos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [insumoEditado, setInsumoeditado] = useState<Insumos | null>(null);

  const handleEditar = (insumo: Insumos) => {
    setInsumoeditado(insumo);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    insumoEditado,
    handleEditar,
  };
};

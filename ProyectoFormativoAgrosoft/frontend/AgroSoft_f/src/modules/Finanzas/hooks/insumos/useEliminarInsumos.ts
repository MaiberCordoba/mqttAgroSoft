import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Insumos } from "../../types";

export const useEliminarInsumos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [insumoEliminado, setInsumoEliminado] = useState<Insumos | null>(null);

  const handleEliminar = (insumo: Insumos) => {
    setInsumoEliminado(insumo);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    insumoEliminado,
    handleEliminar,
    handleSuccess,
  };
};

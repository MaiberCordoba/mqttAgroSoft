import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosInsumos } from "../../types";

export const useEliminarUsoInsumo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoInsumoEliminado, setUsoInsumoEliminado] = useState<UsosInsumos | null>(null);

  const handleEliminar = (usoInsumo: UsosInsumos) => {
    setUsoInsumoEliminado(usoInsumo);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    usoInsumoEliminado,
    handleEliminar,
    handleSuccess,
  };
};

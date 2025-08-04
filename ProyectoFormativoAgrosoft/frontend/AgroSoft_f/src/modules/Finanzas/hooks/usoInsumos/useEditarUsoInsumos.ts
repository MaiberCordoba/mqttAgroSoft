import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosInsumos } from "../../types";

export const useEditarUsoInsumo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoInsumoEdidato, setUsoInsumoEditado] = useState<UsosInsumos | null>(null);

  const handleEditar = (usoInsumo: UsosInsumos) => {
    setUsoInsumoEditado(usoInsumo);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    usoInsumoEdidato,
    handleEditar,
  };
};

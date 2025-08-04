import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TipoControl } from "../../types";

export const useEditarTipoControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoControlEditado, setTipoControlEditado] = useState<TipoControl | null>(null);

  const handleEditar = (tipoControl: TipoControl) => {
    setTipoControlEditado(tipoControl);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    tipoControlEditado,
    handleEditar,
  }; 
};

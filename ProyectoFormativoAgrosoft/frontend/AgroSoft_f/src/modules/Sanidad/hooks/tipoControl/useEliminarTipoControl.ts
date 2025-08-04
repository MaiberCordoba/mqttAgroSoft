import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TipoControl } from "../../types";

export const useEliminarTipoControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoControlEliminado, setTipoControlEliminado] = useState<TipoControl | null>(null);

  const handleEliminar = (tipoControl: TipoControl) => {
    setTipoControlEliminado(tipoControl);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    tipoControlEliminado,
    handleEliminar,
    handleSuccess,
  };
};

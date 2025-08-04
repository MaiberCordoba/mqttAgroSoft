import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Controles } from "../../types";

export const useEliminarControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [controlEliminado, setControlEliminado] = useState<Controles | null>(null);

  const handleEliminar = (control: Controles) => {
    setControlEliminado(control);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    controlEliminado,
    handleEliminar,
    handleSuccess,
  };
};

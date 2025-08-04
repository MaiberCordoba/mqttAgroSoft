import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Desechos } from "../../types";

export const useEliminarDesecho = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [desechoEliminado, setDesechoEliminado] = useState<Desechos | null>(null);

  const handleEliminar = (desecho: Desechos) => {
    setDesechoEliminado(desecho);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    desechoEliminado,
    handleEliminar,
    handleSuccess,
  };
};
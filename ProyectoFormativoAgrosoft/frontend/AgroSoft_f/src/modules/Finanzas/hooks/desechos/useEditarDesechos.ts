import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Desechos } from "../../types";

export const useEditarDesecho = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [desechoEditado, setDesechoEditado] = useState<Desechos | null>(null);

  const handleEditar = (desecho: Desechos) => {
    setDesechoEditado(desecho);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    desechoEditado,
    handleEditar,
  };
};
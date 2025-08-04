import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Controles } from "../../types";

export const useEditarControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [controlEditado, setControlEditado] = useState<Controles | null>(null);

  const handleEditar = (control: Controles) => {
    setControlEditado(control);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    controlEditado,
    handleEditar,
  };
};

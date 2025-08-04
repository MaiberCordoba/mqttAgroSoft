import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Salarios } from "../../types";

export const useEditarSalarios = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [salarioEditado, setSalarioeditado] = useState<Salarios | null>(null);

  const handleEditar = (salario: Salarios) => {
    setSalarioeditado(salario);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    salarioEditado,
    handleEditar,
  };
};

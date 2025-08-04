import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Salarios } from "../../types";

export const useEliminarSalarios = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [salarioEliminado, setSalarioEliminado] = useState<Salarios | null>(null);

  const handleEliminar = (salario: Salarios) => {
    setSalarioEliminado(salario);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    salarioEliminado,
    handleEliminar,
    handleSuccess,
  };
};

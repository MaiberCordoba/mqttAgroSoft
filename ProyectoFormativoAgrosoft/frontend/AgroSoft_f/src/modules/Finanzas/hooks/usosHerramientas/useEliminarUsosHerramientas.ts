import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosHerramientas } from "../../types";

export const useEliminarUsoHerramienta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoHerramientaEliminada, setUsoHerramientaEliminada] = useState<UsosHerramientas | null>(null);

  const handleEliminar = (usoHerramienta: UsosHerramientas) => {
    setUsoHerramientaEliminada(usoHerramienta);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    usoHerramientaEliminada,
    handleEliminar,
    handleSuccess,
  };
};

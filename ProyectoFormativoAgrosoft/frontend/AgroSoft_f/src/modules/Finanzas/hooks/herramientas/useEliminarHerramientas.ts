import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Herramientas } from "../../types";

export const useEliminarHerramienta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [herramientaEliminada, setHerramientaEliminada] = useState<Herramientas | null>(null);

  const handleEliminar = (herramienta: Herramientas) => {
    setHerramientaEliminada(herramienta);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    herramientaEliminada,
    handleEliminar,
    handleSuccess,
  };
};

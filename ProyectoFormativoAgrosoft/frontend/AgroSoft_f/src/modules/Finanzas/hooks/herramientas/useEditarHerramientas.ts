import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Herramientas } from "../../types";

export const useEditarHerramienta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [herramientaEditada, setHerramientaEditada] = useState<Herramientas | null>(null);

  const handleEditar = (herramienta: Herramientas) => {
    setHerramientaEditada(herramienta);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    herramientaEditada,
    handleEditar,
  };
};

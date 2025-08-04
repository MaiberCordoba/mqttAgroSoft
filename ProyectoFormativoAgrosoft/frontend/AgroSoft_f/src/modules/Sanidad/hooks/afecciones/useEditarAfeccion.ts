import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Afecciones } from "../../types";

export const useEditarAfeccion = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [afeccionEditada, setAfeccionEditada] = useState<Afecciones | null>(null);

  const handleEditar = (afeccion: Afecciones) => {
    setAfeccionEditada(afeccion);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    afeccionEditada,
    handleEditar,
  };
};
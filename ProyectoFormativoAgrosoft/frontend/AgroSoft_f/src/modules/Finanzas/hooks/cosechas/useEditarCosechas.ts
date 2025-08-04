import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cosechas } from "../../types";

export const useEditarCosecha = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [cosechaEditada, setCosechaEditada] = useState<Cosechas | null>(null);

  const handleEditar = (cosecha: Cosechas) => {
    setCosechaEditada(cosecha);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    cosechaEditada,
    handleEditar,
  };
};
import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Cultivo } from "../../types";

export const useEditarCultivos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [CultivosEditada, setCultivosEditada] = useState<Cultivo | null>(null);

  const handleEditar = (Cultivos: Cultivo) => {
    setCultivosEditada(Cultivos);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    CultivosEditada,
    handleEditar,
  };
};
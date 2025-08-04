import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposEspecie } from "../../types";

export const useEditarTiposEspecie = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [TiposEspecieEditada, setTiposEspecieEditada] = useState<TiposEspecie | null>(null);

  const handleEditar = (TiposEspecie: TiposEspecie) => {
    setTiposEspecieEditada(TiposEspecie);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    TiposEspecieEditada,
    handleEditar,
  };
};
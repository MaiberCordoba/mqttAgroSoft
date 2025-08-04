import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposEspecie } from "../../types";

export const useEliminarTiposEspecie = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [TiposEspecieEliminada, setTiposEspecieEliminada] = useState<TiposEspecie | null>(null);

  const handleEliminar = (TiposEspecie: TiposEspecie) => {
    setTiposEspecieEliminada(TiposEspecie);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    TiposEspecieEliminada,
    handleEliminar,
    handleSuccess,
  };
};
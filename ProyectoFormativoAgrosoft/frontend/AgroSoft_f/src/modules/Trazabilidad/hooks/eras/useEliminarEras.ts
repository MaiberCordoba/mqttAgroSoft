import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Eras } from "../../types";

export const useEliminarEras = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [ErasEliminada, setErasEliminada] = useState<Eras | null>(null);

  const handleEliminar = (Eras: Eras) => {
    setErasEliminada(Eras);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    ErasEliminada,
    handleEliminar,
    handleSuccess,
  };
};
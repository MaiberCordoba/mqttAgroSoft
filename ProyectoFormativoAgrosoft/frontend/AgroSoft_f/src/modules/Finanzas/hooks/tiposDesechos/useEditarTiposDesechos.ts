import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposDesechos } from "../../types";

export const useEditarTiposDesechos = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tiposDesechosEditada, setTiposDesechosEditada] = useState<TiposDesechos | null>(null);

  const handleEditar = (tipoDesecho: TiposDesechos) => {
    setTiposDesechosEditada(tipoDesecho);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    tiposDesechosEditada,
    handleEditar,
  };
};
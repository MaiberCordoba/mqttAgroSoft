import { UseModal } from "@/hooks/useModal";
import { UnidadesTiempo } from "../../types";
import { useState } from "react";

export const useCrearUnidadesTiempo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadTiempoCreada, setUnidadTiempoCreada] = useState<UnidadesTiempo | null>(null);

  const handleCrear = (unidadTiempo: UnidadesTiempo) => {
    setUnidadTiempoCreada(unidadTiempo);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    unidadTiempoCreada,
    handleCrear,
  };
};

import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UnidadesTiempo } from "../../types";

export const useEliminarUnidadesTiempo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadTiempoEliminada, setUnidadTiempoEliminada] = useState<UnidadesTiempo | null>(null);

  const handleEliminar = (unidad: UnidadesTiempo) => {
    setUnidadTiempoEliminada(unidad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    unidadTiempoEliminada,
    handleEliminar,
    handleSuccess,
  };
};

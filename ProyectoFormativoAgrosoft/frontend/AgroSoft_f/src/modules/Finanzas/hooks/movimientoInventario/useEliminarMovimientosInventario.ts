import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { MovimientoInventario } from "../../types";

export const useEliminarMovimientoInventario = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [movimientoEliminado, setMovimientoEliminado] = useState<MovimientoInventario | null>(null);

  const handleEliminar = (movimiento: MovimientoInventario) => {
    setMovimientoEliminado(movimiento);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    movimientoEliminado,
    handleEliminar,
    handleSuccess,
  };
};

import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { MovimientoInventario } from "../../types";

export const useEditarMovimientoInventario = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [movimientoEditado, setMovimientoeditado] = useState<MovimientoInventario | null>(null);

  const handleEditar = (movimiento: MovimientoInventario) => {
    setMovimientoeditado(movimiento);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    movimientoEditado,
    handleEditar,
  };
};

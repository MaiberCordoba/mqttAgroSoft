import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Ventas } from "../../types";

export const useEliminarVenta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [ventaEliminada, setVentaEliminada] = useState<Ventas | null>(null);

  const handleEliminar = (venta: Ventas) => {
    setVentaEliminada(venta);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    ventaEliminada,
    handleEliminar,
    handleSuccess,
  };
};

import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Ventas } from "../../types";

export const useEditarVenta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [ventaEditada, setVentaEditada] = useState<Ventas | null>(null);

  const handleEditar = (venta: Ventas) => {
    setVentaEditada(venta);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    ventaEditada,
    handleEditar,
  };
};

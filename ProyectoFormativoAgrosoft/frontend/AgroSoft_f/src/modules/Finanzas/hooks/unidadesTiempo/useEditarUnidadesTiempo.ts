import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UnidadesTiempo } from "../../types";

export const useEditarUnidadesTiempo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadTiempoEditada, setUnidadTiempoEditada] = useState<UnidadesTiempo | null>(null);

  const handleEditar = (unidad: UnidadesTiempo) => {
    setUnidadTiempoEditada(unidad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    unidadTiempoEditada,
    handleEditar,
  };
};

import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UnidadesMedida } from "../../types";

export const useEliminarUnidadesMedida = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadMedidaEliminada, setUnidadMedidaEliminada] = useState<UnidadesMedida | null>(null);

  const handleEliminar = (unidad: UnidadesMedida) => {
    setUnidadMedidaEliminada(unidad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    unidadMedidaEliminada,
    handleEliminar,
    handleSuccess,
  };
};

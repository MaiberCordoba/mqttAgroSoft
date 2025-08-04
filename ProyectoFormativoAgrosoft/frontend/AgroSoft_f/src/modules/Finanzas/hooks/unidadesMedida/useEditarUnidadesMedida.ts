import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UnidadesMedida } from "../../types";

export const useEditarUnidadesMedida = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadMedidaEditada, setUnidadMedidaEditada] = useState<UnidadesMedida | null>(null);

  const handleEditar = (unidad: UnidadesMedida) => {
    setUnidadMedidaEditada(unidad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    unidadMedidaEditada,
    handleEditar,
  };
};

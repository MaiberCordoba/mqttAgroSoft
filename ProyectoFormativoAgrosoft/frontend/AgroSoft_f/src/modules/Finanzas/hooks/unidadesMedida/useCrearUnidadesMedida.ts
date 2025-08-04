import { UseModal } from "@/hooks/useModal";
import { UnidadesMedida } from "../../types";
import { useState } from "react";

export const useCrearUnidadesMedida = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [unidadMedidaCreada, setUnidadMedidaCreada] = useState<UnidadesMedida | null>(null);

  const handleCrear = (unidadMedida: UnidadesMedida) => {
    setUnidadMedidaCreada(unidadMedida);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    unidadMedidaCreada,
    handleCrear,
  };
};

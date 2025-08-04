import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { UsosHerramientas } from "../../types";

export const useEditarUsoHerramienta = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [usoHerramientaEdidata, setUsoHerramientaEditada] = useState<UsosHerramientas | null>(null);

  const handleEditar = (usoHerramienta: UsosHerramientas) => {
    setUsoHerramientaEditada(usoHerramienta);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    usoHerramientaEdidata,
    handleEditar,
  };
};

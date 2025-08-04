import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Semillero } from "../../types";

export const useEditarSemilleros = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [SemillerosEditada, setSemillerosEditada] = useState<Semillero | null>(null);

  const handleEditar = (Semilleros: Semillero) => {
    setSemillerosEditada(Semilleros);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    SemillerosEditada,
    handleEditar,
  };
};
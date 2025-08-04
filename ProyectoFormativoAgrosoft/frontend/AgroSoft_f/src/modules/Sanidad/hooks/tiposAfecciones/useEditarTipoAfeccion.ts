import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposAfecciones } from "../../types";

export const useEditarTipoAfeccion = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoafeccionEditada, setTipoAfeccionEditada] = useState<TiposAfecciones| null>(null);

  const handleEditar = (tipoafeccion: TiposAfecciones) => {
    setTipoAfeccionEditada(tipoafeccion);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    tipoafeccionEditada,
    handleEditar,
  };
};
import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiposAfecciones } from "../../types";

export const useEliminarTipoAfeccion = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoafeccionEliminada, setTipoAfeccionEliminada] = useState<TiposAfecciones | null>(null);

  const handleEliminar = (tipoafeccion: TiposAfecciones) => {
    setTipoAfeccionEliminada(tipoafeccion);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    tipoafeccionEliminada,
    handleEliminar,
    handleSuccess,
  };
};
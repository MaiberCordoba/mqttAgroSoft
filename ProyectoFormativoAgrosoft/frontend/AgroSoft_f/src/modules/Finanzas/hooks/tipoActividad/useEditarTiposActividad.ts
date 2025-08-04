import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TipoActividad } from "../../types";

export const useEditarTipoActividad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoActividadEditada, setTipoActividadEditada] = useState<TipoActividad | null>(null);

  const handleEditar = (tipoActividad: TipoActividad) => {
    setTipoActividadEditada(tipoActividad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    tipoActividadEditada,
    handleEditar,
  };
};
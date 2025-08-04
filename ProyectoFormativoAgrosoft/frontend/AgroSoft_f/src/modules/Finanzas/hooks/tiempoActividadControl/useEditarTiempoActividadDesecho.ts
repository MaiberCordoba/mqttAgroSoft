import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiempoActividadControl } from "../../types";

export const useEditarTiempoActividadControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tiempoActividadControlEditada, setTiempoActividadControlEditada] = useState<TiempoActividadControl | null>(null);

  const handleEditar = (tiempoActividad: TiempoActividadControl) => {
    setTiempoActividadControlEditada(tiempoActividad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    tiempoActividadControlEditada,
    handleEditar,
  };
};
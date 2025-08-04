import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TiempoActividadControl } from "../../types";

export const useEliminarTiempoActividadControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tiempoActividadControlEliminada, setTiempoActividadControlEliminada] = useState<TiempoActividadControl | null>(null);

  const handleEliminar = (tiempoActividad: TiempoActividadControl) => {
    setTiempoActividadControlEliminada(tiempoActividad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    tiempoActividadControlEliminada,
    handleEliminar,
    handleSuccess,
  };
};
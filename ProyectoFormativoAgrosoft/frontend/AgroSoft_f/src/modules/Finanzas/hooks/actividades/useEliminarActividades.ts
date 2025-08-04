import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Actividades } from "../../types";

export const useEliminarActividad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [actividadEliminada, setActividadEliminada] = useState<Actividades | null>(null);

  const handleEliminar = (actividad: Actividades) => {
    setActividadEliminada(actividad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    actividadEliminada,
    handleEliminar,
    handleSuccess,
  };
};
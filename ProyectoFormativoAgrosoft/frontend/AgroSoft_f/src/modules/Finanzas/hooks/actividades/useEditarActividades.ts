import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Actividades } from "../../types";

export const useEditarActividad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [actividadEditada, setActividadEditada] = useState<Actividades | null>(null);

  const handleEditar = (actividad: Actividades) => {
    setActividadEditada(actividad);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    actividadEditada,
    handleEditar,
  };
};
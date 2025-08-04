import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { TipoActividad} from "../../types";

export const useEliminarTipoActividad= () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [tipoActividadEliminada, setTipoActividadEliminada] = useState<TipoActividad| null>(null);

  const handleEliminar = (tipoActividad: TipoActividad) => {
    setTipoActividadEliminada(tipoActividad);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    tipoActividadEliminada,
    handleEliminar,
    handleSuccess,
  };
};
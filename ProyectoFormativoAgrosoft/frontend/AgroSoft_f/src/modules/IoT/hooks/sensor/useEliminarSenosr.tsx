import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { SensorData } from "../../types/sensorTypes";


export const useEliminarSensor= () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [sensorEliminado, setSensorEliminado] = useState<SensorData | null>(null);

  const handleEliminar = (sensor: SensorData) => {
    setSensorEliminado(sensor);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    sensorEliminado,
    handleEliminar,
    handleSuccess,
  };
};
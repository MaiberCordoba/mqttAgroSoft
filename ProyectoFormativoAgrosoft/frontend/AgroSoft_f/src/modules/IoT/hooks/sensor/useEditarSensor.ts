import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { SensorData } from "../../types/sensorTypes";

export const useEditarSensor= () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [sensorEditado, setSensorEditado] = useState<SensorData | null>(null);

  const handleEditar = (sensor: SensorData) => {
    setSensorEditado(sensor);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    sensorEditado,
    handleEditar,
  };
};
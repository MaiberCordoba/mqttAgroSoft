import { UseModal } from "@/hooks/useModal";
import { SensorData } from "../../types/sensorTypes";
import { useState } from "react";

export const useCrearSensor = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [sensorCreado, setSensorCreado] = useState<SensorData | null>(null);

    const handleCrear = (sensorData: SensorData) => {
        const newSensor: SensorData = {
            ...sensorData,
            id: 0, 
            fk_lote_id: sensorData.fk_lote_id ?? null,
            fk_eras_id: sensorData.fk_eras_id ?? null
        };
        
        setSensorCreado(newSensor);
        openModal();
    };

    const resetSensor = () => {
        setSensorCreado(null);
    };

    return {
        isOpen,
        openModal,
        closeModal,
        sensorCreado,
        handleCrear,
        resetSensor
    };
};
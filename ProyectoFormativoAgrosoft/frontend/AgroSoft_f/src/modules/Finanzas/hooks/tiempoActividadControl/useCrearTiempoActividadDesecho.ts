import { UseModal } from "@/hooks/useModal"
import { TiempoActividadControl } from "../../types";
import { useState } from "react";


export const useCrearTiempoActividadControl = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [tiempoActividadControlCreada, setTiempoActividadControlCreada] = useState<TiempoActividadControl | null>(null);

    const handleCrear = (tiempoActividad: TiempoActividadControl) => {
        setTiempoActividadControlCreada(tiempoActividad);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        tiempoActividadControlCreada,
        handleCrear,
    };
};
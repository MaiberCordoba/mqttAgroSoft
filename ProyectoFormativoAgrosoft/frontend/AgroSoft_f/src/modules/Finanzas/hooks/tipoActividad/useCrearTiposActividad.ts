import { UseModal } from "@/hooks/useModal"
import { TipoActividad } from "../../types";
import { useState } from "react";


export const useCrearTipoActividad = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [TipoActividadCreada, setTipoActividadCreada] = useState<TipoActividad | null>(null);

    const handleCrear = (tipoActividad: TipoActividad) => {
        setTipoActividadCreada(tipoActividad);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        TipoActividadCreada,
        handleCrear,
    };
};
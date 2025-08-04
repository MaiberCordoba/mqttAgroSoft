import { UseModal } from "@/hooks/useModal"
import { Actividades } from "../../types";
import { useState } from "react";


export const useCrearActividad = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [actividadCreada, setActividadCreada] = useState<Actividades | null>(null);

    const handleCrear = (actividad: Actividades) => {
        setActividadCreada(actividad);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        actividadCreada,
        handleCrear,
    };
};
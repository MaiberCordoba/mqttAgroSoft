import { UseModal } from "@/hooks/useModal"
import { Plantaciones } from "../../types";
import { useState } from "react";


export const useCrearPlantaciones = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [PlantacionesCreada, setPlantacionesCreada] = useState<Plantaciones | null>(null);

    const handleCrear = (Plantaciones: Plantaciones) => {
        setPlantacionesCreada(Plantaciones);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        PlantacionesCreada,
        handleCrear,
    };
};
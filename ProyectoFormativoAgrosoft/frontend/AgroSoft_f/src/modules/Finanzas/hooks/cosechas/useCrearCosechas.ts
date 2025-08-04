import { UseModal } from "@/hooks/useModal"
import { Cosechas } from "../../types";
import { useState } from "react";


export const useCrearCosecha = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [cosechaCreada, setCosechaCreada] = useState<Cosechas | null>(null);

    const handleCrear = (cosecha: Cosechas) => {
        setCosechaCreada(cosecha);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        cosechaCreada,
        handleCrear,
    };
};
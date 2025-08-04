import { UseModal } from "@/hooks/useModal"
import { Especies } from "../../types";
import { useState } from "react";


export const useCrearEspecies = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [EspeciesCreada, setEspeciesCreada] = useState<Especies | null>(null);

    const handleCrear = (Especies: Especies) => {
        setEspeciesCreada(Especies);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        EspeciesCreada,
        handleCrear,
    };
};
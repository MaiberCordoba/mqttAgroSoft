import { UseModal } from "@/hooks/useModal"
import { Semilleros } from "../../types";
import { useState } from "react";


export const useCrearSemilleros = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [SemillerosCreada, setSemillerosCreada] = useState<Semilleros | null>(null);

    const handleCrear = (Semilleros: Semilleros) => {
        setSemillerosCreada(Semilleros);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        SemillerosCreada,
        handleCrear,
    };
};
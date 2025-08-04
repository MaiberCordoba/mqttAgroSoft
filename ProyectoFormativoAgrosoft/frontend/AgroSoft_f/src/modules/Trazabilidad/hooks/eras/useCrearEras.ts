import { UseModal } from "@/hooks/useModal"
import { Eras } from "../../types";
import { useState } from "react";


export const useCrearEras = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [ErasCreada, setErasCreada] = useState<Eras | null>(null);

    const handleCrear = (Eras: Eras) => {
        setErasCreada(Eras);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        ErasCreada,
        handleCrear,
    };
};
import { UseModal } from "@/hooks/useModal"
import { Afecciones } from "../../types";
import { useState } from "react";


export const useCrearAfeccion = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [afeccionCreada, setAfeccionCreada] = useState<Afecciones | null>(null);

    const handleCrear = (afeccion: Afecciones) => {
        setAfeccionCreada(afeccion);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        afeccionCreada,
        handleCrear,
    };
};
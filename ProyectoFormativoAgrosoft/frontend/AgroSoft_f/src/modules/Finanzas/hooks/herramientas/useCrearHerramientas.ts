import { UseModal } from "@/hooks/useModal";
import { Herramientas } from "../../types";
import { useState } from "react";

export const useCrearHerramienta = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [herramientaCreada, setHerramientaCreada] = useState<Herramientas | null>(null);

    const handleCrear = (herramienta: Herramientas) => {
        setHerramientaCreada(herramienta);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        herramientaCreada,
        handleCrear,
    };
};

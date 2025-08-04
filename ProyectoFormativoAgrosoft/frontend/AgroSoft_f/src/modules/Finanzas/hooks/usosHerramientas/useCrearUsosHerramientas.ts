import { UseModal } from "@/hooks/useModal";
import { UsosHerramientas } from "../../types";
import { useState } from "react";

export const useCrearUsosHerramienta = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [usoHerramientaCreada, setUsoHerramientaCreada] = useState<UsosHerramientas | null>(null);

    const handleCrear = (usoHerramienta: UsosHerramientas) => {
        setUsoHerramientaCreada(usoHerramienta);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        usoHerramientaCreada,
        handleCrear,
    };
};

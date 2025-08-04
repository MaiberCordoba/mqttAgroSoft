import { UseModal } from "@/hooks/useModal";
import { AfeccionesCultivo } from "../../types";
import { useState } from "react";

export const useCrearAfeccionCultivo = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [afeccionCultivoCreada, setAfeccionCultivoCreada] = useState<AfeccionesCultivo | null>(null);

    const handleCrear = (afeccionCultivo: AfeccionesCultivo) => {
        setAfeccionCultivoCreada(afeccionCultivo);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        afeccionCultivoCreada,
        handleCrear,
    };
};

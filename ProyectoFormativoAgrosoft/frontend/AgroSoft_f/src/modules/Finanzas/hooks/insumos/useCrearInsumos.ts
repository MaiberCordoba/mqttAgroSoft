import { UseModal } from "@/hooks/useModal";
import { Insumos } from "../../types";
import { useState } from "react";

export const useCrearInsumos = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [insumoCreado, setInsumoCreado] = useState<Insumos | null>(null);

    const handleCrear = (insumo: Insumos) => {
        setInsumoCreado(insumo);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        insumoCreado,
        handleCrear,
    };
};

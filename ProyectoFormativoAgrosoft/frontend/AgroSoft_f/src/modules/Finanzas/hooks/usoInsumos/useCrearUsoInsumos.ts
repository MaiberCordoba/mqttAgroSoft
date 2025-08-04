import { UseModal } from "@/hooks/useModal";
import { UsosInsumos } from "../../types";
import { useState } from "react";

export const useCrearUsosInsumo = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [usoInsumoCreado, setUsoInsumoCreado] = useState<UsosInsumos | null>(null);

    const handleCrear = (usoInsumo: UsosInsumos) => {
        setUsoInsumoCreado(usoInsumo);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        usoInsumoCreado,
        handleCrear,
    };
};

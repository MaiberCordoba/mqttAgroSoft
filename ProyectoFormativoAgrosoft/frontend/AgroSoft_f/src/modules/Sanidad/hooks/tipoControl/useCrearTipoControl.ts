import { UseModal } from "@/hooks/useModal";
import { TipoControl } from "../../types";
import { useState } from "react";

export const useCrearTipoControl = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [tipoControlCreado, setTipoControlCreado] = useState<TipoControl | null>(null);

    const handleCrear = (tipoControl: TipoControl) => {
        setTipoControlCreado(tipoControl);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        tipoControlCreado,
        handleCrear,
    };
};

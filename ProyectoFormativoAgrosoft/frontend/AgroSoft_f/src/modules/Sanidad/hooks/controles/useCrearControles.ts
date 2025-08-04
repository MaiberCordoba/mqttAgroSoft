import { UseModal } from "@/hooks/useModal";
import { Controles } from "../../types";
import { useState } from "react";

export const useCrearControl = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [controlCreado, setControlCreado] = useState<Controles | null>(null);

    const handleCrear = (control: Controles) => {
        setControlCreado(control);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        controlCreado,
        handleCrear,
    };
};

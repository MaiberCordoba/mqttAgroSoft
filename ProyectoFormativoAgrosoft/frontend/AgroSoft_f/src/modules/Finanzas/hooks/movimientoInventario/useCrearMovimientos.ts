import { UseModal } from "@/hooks/useModal";
import { MovimientoInventario } from "../../types";
import { useState } from "react";

export const useCrearMovimientoInventario = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [movimientoCreado, setMovimientoCreado] = useState<MovimientoInventario | null>(null);

    const handleCrear = (movimiento: MovimientoInventario) => {
        setMovimientoCreado(movimiento);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        movimientoCreado,
        handleCrear,
    };
};

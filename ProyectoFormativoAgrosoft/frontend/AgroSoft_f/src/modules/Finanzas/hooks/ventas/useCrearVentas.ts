import { UseModal } from "@/hooks/useModal"
import { Ventas } from "../../types";
import { useState } from "react";

export const useCrearVenta = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [ventaCreada, setVentaCreada] = useState<Ventas | null>(null);

    const handleCrear = (venta: Ventas) => {
        setVentaCreada(venta);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        ventaCreada,
        handleCrear,
    };
};

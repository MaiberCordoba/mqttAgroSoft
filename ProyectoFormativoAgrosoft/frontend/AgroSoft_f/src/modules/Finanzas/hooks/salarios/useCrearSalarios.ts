import { UseModal } from "@/hooks/useModal";
import { Salarios } from "../../types";
import { useState } from "react";

export const useCrearSalarios = () => {
    const { isOpen, openModal, closeModal } = UseModal();
    const [salarioCreado, setSalarioCreado] = useState<Salarios | null>(null);

    const handleCrear = (salario: Salarios) => {
        setSalarioCreado(salario);
        openModal();
    };

    return {
        isOpen,
        closeModal,
        salarioCreado,
        handleCrear,
    };
};

import { UseModal } from "@/hooks/useModal"
import { Desechos } from "../../types";
import { useState } from "react";


export const useCrearDesecho = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [desechoCreado, setDesechoCreado] = useState<Desechos | null>(null);

    const handleCrear = (desecho: Desechos) => {
        setDesechoCreado(desecho);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        desechoCreado,
        handleCrear,
    };
};
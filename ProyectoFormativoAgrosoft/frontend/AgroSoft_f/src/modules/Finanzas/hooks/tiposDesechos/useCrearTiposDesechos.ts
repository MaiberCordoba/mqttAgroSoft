import { UseModal } from "@/hooks/useModal"
import { TiposDesechos } from "../../types";
import { useState } from "react";


export const useCrearTiposDesechos = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [TiposDesechosCreada, setTiposDesechosCreada] = useState<TiposDesechos | null>(null);

    const handleCrear = (tipoDesecho: TiposDesechos) => {
        setTiposDesechosCreada(tipoDesecho);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        TiposDesechosCreada,
        handleCrear,
    };
};
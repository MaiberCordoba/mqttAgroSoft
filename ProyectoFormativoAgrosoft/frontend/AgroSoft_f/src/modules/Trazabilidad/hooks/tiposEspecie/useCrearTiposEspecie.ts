import { UseModal } from "@/hooks/useModal"
import { TiposEspecie } from "../../types";
import { useState } from "react";


export const useCrearTiposEspecie = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [TiposEspecieCreada, setTiposEspecieCreada] = useState<TiposEspecie | null>(null);

    const handleCrear = (TiposEspecie: TiposEspecie) => {
        setTiposEspecieCreada(TiposEspecie);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        TiposEspecieCreada,
        handleCrear,
    };
};
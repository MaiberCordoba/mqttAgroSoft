import { UseModal } from "@/hooks/useModal"
import { Cultivo } from "../../types";
import { useState } from "react";


export const useCrearCultivos = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [CultivosCreada, setCultivosCreada] = useState<Cultivo | null>(null);

    const handleCrear = (Cultivos: Cultivo) => {
        setCultivosCreada(Cultivos);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        CultivosCreada,
        handleCrear,
    };
};
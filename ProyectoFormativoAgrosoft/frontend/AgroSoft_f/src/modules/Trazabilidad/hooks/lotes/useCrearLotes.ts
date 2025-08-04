import { UseModal } from "@/hooks/useModal"
import { Lotes } from "../../types";
import { useState } from "react";


export const useCrearLotes = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [LotesCreada, setLotesCreada] = useState<Lotes | null>(null);

    const handleCrear = (Lotes: Lotes) => {
        setLotesCreada(Lotes);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        LotesCreada,
        handleCrear,
    };
};
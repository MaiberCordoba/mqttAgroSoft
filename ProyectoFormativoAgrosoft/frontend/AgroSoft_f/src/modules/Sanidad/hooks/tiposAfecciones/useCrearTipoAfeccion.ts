import { UseModal } from "@/hooks/useModal"
import { TiposAfecciones } from "../../types";
import { useState } from "react";


export const useCrearTipoAfeccion = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [tipoafeccionCreada, setTipoAfeccionCreada] = useState<TiposAfecciones | null>(null);

    const handleCrear = (tipoafeccion: TiposAfecciones) => {
        setTipoAfeccionCreada(tipoafeccion);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        tipoafeccionCreada,
        handleCrear,
    };
};
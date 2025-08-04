import { UseModal } from "@/hooks/useModal"
import { useState } from "react";
import { User } from "../types";


export const useCrearUsers = () => {
    const {isOpen, openModal, closeModal} = UseModal();
    const [UsersCreada, setUsersCreada] = useState<User | null>(null);

    const handleCrear = (Users: User) => {
        setUsersCreada(Users);
        openModal();
    };

    return{
        isOpen,
        closeModal,
        UsersCreada,
        handleCrear,
    };
};
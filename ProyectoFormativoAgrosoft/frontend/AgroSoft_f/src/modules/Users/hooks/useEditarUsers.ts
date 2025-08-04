import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { User } from "../types";


export const useEditarUsers = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [UsersEditada, setUsersEditada] = useState<User | null>(null);

  const handleEditar = (Users: User) => {
    setUsersEditada(Users);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    UsersEditada,
    handleEditar,
  };
};
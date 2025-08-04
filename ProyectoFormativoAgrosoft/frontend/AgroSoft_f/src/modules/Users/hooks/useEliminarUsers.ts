import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { User } from "../types";

export const useEliminarUsers = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [UsersEliminada, setUsersEliminada] = useState<User | null>(null);

  const handleEliminar = (Users: User) => {
    setUsersEliminada(Users);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };



  return {
    isOpen,
    closeModal,
    UsersEliminada,
    handleEliminar,
    handleSuccess,
  };
};
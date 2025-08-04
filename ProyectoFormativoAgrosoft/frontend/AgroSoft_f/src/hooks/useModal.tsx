import { useState } from "react"

type useModalType = {
    isOpen : boolean;
    openModal : () => void;
    closeModal : () => void;
};

export function UseModal (): useModalType{
    const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};
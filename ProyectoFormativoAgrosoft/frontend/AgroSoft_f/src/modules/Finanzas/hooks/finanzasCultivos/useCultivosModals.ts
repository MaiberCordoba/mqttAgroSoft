import { useState } from 'react';

export const useCultivoModals = () => {
  const [activeModal, setActiveModal] = useState<
    'actividades' | 'controles' | 'cosechas' | 'ventas' | null
  >(null);

  const openModal = (modalType: typeof activeModal) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    activeModal,
    openModal,
    closeModal,
  };
};
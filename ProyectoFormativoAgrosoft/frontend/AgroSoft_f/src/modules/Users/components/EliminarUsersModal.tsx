import React from 'react';
import ModalComponent from '@/components/Modal';

import { AlertCircle } from 'lucide-react';
import { User } from '../types';
import { useDeleteUsers } from '../hooks/useDelateUsers';

interface EliminarUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarUserModal: React.FC<EliminarUserModalProps> = ({ 
  user, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteUsers();

  const handleConfirmDelete = () => {
    mutate(
      { id: user.id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footerButtons={[
        {
          label: isPending ? "Eliminando..." : "Eliminar",
          color: 'success', // Cambiado a 'danger' para acciones destructivas
          variant: 'light',
          onClick: handleConfirmDelete,
        },
      ]}
    >
      <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 p-3 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Eliminar usuario "{user.nombre} {user.apellidos}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente al usuario y todos sus datos asociados.
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarUserModal;
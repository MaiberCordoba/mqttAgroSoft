import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteDesecho } from '../../hooks/desechos/useDeleteDesechos';  // Cambié el hook
import { Desechos } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarDesechoModalProps {
  desecho: Desechos;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarDesechoModal: React.FC<EliminarDesechoModalProps> = ({ 
  desecho, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteDesecho();  

  const handleConfirmDelete = () => {
    mutate(
      { id: desecho.id },
      {
        onSuccess: () => {
          onClose();  // Cierra el modal después de eliminar
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
          label: isPending ? "Borrando..." : "Borrar",
          color: 'success',
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
          ¿Eliminar "{desecho.nombre}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el desecho del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarDesechoModal;

import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteSalarios } from '../../hooks/salarios/useDeleteSalarios'; // Hook para eliminar salarios
import { Salarios } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarSalarioModalProps {
  salario: Salarios;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarSalarioModal: React.FC<EliminarSalarioModalProps> = ({ 
  salario, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteSalarios();  

  const handleConfirmDelete = () => {
    mutate(
      { id: salario.id },
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
          ¿Eliminar el salario de "{salario.nombre}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente este salario del sistema. 
          ¿Estás segur@ de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarSalarioModal;

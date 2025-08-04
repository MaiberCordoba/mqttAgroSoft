import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteHerramienta } from '../../hooks/herramientas/useDeleteHerramientas';  // Cambié el hook
import { Herramientas } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarHerramientaModalProps {
  herramienta: Herramientas;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarHerramientaModal: React.FC<EliminarHerramientaModalProps> = ({ 
  herramienta, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteHerramienta();  

  const handleConfirmDelete = () => {
    mutate(
      { id: herramienta.id },
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
          ¿Eliminar "{herramienta.nombre}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente la herramienta del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarHerramientaModal;

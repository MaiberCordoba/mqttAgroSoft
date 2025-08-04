import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteUsoInsumo } from '../../hooks/usoInsumos/useDeleteUsoInsumos';  
import { UsosInsumos } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarUsoInsumoModalProps {
  usoInsumo: UsosInsumos;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarUsoInsumoModal: React.FC<EliminarUsoInsumoModalProps> = ({ 
  usoInsumo, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteUsoInsumo();  

  const handleConfirmDelete = () => {
    mutate(
      { id: usoInsumo.id },
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
          ¿Eliminar el uso del insumo "{usoInsumo.insumo?.nombre}" en la actividad "{usoInsumo.actividad?.titulo}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el registro del uso del insumo en el sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarUsoInsumoModal;

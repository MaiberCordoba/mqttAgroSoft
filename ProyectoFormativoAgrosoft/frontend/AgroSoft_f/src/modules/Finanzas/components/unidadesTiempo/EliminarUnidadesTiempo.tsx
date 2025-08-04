import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteUnidadesTiempo } from '../../hooks/unidadesTiempo/useDeleteUnidadesTiempo';
import { UnidadesTiempo } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarUnidadesTiempoModalProps {
  unidadTiempo: UnidadesTiempo;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarUnidadesTiempoModal: React.FC<EliminarUnidadesTiempoModalProps> = ({
  unidadTiempo,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteUnidadesTiempo();

  const handleConfirmDelete = () => {
    mutate(
      { id: unidadTiempo.id },
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
          label: isPending ? 'Borrando...' : 'Borrar',
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
          ¿Eliminar "{unidadTiempo.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente la unidad de tiempo del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarUnidadesTiempoModal;

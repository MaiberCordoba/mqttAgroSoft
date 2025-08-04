import React from 'react';
import ModalComponent from '@/components/Modal';
import { useDeleteTiempoActividadControl } from '../../hooks/tiempoActividadControl/useDeleteTiempoActividadDesecho';
import { TiempoActividadControl } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarTiempoActividadControlModalProps {
  tiempoActividadControl: TiempoActividadControl;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarTiempoActividadControlModal: React.FC<EliminarTiempoActividadControlModalProps> = ({ 
  tiempoActividadControl, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteTiempoActividadControl();

  const handleConfirmDelete = () => {
    mutate(
      { id: tiempoActividadControl.id },
      {
        onSuccess: () => {
          onClose(); // Cierra el modal después de eliminar
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
          ¿Eliminar el registro de tiempo con ID {tiempoActividadControl.id}?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente este registro del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarTiempoActividadControlModal;

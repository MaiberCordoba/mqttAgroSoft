import React from 'react'; 
import ModalComponent from '@/components/Modal';
import { useDeleteTipoActividad } from '../../hooks/tipoActividad/useDeleteTiposActividad';
import { TipoActividad } from '../../types';
import { AlertCircle } from 'lucide-react';

interface EliminarTipoActividadModalProps {
  tipoActividad: TipoActividad;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarTipoActividadModal: React.FC<EliminarTipoActividadModalProps> = ({ 
  tipoActividad, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteTipoActividad();

  const handleConfirmDelete = () => {
    mutate(
      { id: tipoActividad.id },
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
          ¿Eliminar "{tipoActividad.nombre}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el tipo de actividad del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarTipoActividadModal;

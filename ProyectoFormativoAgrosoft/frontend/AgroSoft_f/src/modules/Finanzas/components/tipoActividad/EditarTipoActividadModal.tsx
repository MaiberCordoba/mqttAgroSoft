import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchTipoActividades } from '../../hooks/tipoActividad/usePatchTiposActividad';
import { TipoActividad } from '../../types';
import { Input } from '@heroui/react';

interface EditarTipoActividadModalProps {
  tipoActividad: TipoActividad;
  onClose: () => void;
}

const EditarTipoActividadModal: React.FC<EditarTipoActividadModalProps> = ({ tipoActividad, onClose }) => {
  const [nombre, setNombre] = useState<string>(tipoActividad.nombre);
  const { mutate, isPending } = usePatchTipoActividades();

  const handleSubmit = () => {
    if (!nombre) {
      console.log("Por favor, completa el campo nombre.");
      return;
    }

    mutate(
      {
        id: tipoActividad.id,
        data: {
          nombre,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Tipo de Actividad"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        size="sm"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
      />
    </ModalComponent>
  );
};

export default EditarTipoActividadModal;

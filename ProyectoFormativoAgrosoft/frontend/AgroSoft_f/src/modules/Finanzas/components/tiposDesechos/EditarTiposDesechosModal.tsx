import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchTiposDesechos } from '../../hooks/tiposDesechos/usePatchTiposDesechos';
import { TiposDesechos } from '../../types';
import { Input,Textarea} from '@heroui/react';

interface EditarTiposDesechosModalProps {
  tipoDesecho: TiposDesechos; // La afección que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarTiposDesechosModal: React.FC<EditarTiposDesechosModalProps> = ({ tipoDesecho, onClose }) => {
  const [nombre, setNombre] = useState<string>(tipoDesecho.nombre);
  const [descripcion, setDescripcion] = useState<string>(tipoDesecho.descripcion);

  const { mutate, isPending } = usePatchTiposDesechos();

  const handleSubmit = () => {
    // Llama a la mutación para actualizar la afección
    mutate(
      {
        id: tipoDesecho.id,
        data: {
          nombre,
          descripcion,
        },
      },
      {
        onSuccess: () => {
          onClose(); // Cierra el modal después de guardar
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Tipo de desecho"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
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
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        size="sm"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
      />
    </ModalComponent>
  );
};

export default EditarTiposDesechosModal;
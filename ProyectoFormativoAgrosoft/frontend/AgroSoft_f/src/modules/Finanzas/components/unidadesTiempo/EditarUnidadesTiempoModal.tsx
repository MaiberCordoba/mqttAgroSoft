import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input } from '@heroui/react';
import { usePatchUnidadesTiempo } from '../../hooks/unidadesTiempo/usePatchUnidadesTiempo';
import { UnidadesTiempo } from '../../types';

interface EditarUnidadesTiempoModalProps {
  unidadTiempo: UnidadesTiempo;
  onClose: () => void;
}

const EditarUnidadesTiempoModal: React.FC<EditarUnidadesTiempoModalProps> = ({ unidadTiempo, onClose }) => {
  const [nombre, setNombre] = useState<string>(unidadTiempo.nombre);
  const [equivalenciaMinutos, setEquivalenciaMinutos] = useState(unidadTiempo.equivalenciaMinutos);

  const [error,setError] = useState("")

  const { mutate, isPending } = usePatchUnidadesTiempo();

  const handleSubmit = () => {
    if (equivalenciaMinutos < 0){
      setError("Ingresa una equivalencia valida")
      return
    }
    setError("")
    mutate(
      {
        id: unidadTiempo.id,
        data: {
          nombre,
          equivalenciaMinutos,
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
      title="Editar Unidad de Tiempo"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          onClick: handleSubmit,
        },
      ]}
    >
      <p className='text-red-500 text-sm mb-2'>{error}</p>
      <Input
        value={nombre}
        label="Nombre"
        size="sm"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Input
        value={equivalenciaMinutos.toString()}
        label="Equivalencia Minutos"
        size="sm"
        type="number"
        onChange={(e) => setEquivalenciaMinutos(Number(e.target.value))}
      />
    </ModalComponent>
  );
};

export default EditarUnidadesTiempoModal;

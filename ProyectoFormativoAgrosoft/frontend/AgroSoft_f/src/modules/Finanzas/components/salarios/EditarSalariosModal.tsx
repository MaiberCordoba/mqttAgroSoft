import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchSalarios } from '../../hooks/salarios/usePatchSalarios';
import { Salarios } from '../../types';
import { Input, Select, SelectItem } from '@heroui/react';

interface EditarSalariosModalProps {
  salario: Salarios;
  onClose: () => void;
}

const EditarSalariosModal: React.FC<EditarSalariosModalProps> = ({ salario, onClose }) => {
  const [nombre, setNombre] = useState<string>(salario.nombre);
  const [monto, setMonto] = useState<string>(salario.monto.toString());
  const [horas, setHoras] = useState<string>(salario.horas.toString());
  const [estado, setEstado] = useState<"activo" | "inactivo">(salario.estado);
  const [error, setError] = useState("");

  const { mutate, isPending } = usePatchSalarios();

  const handleSubmit = () => {
    const montoNum = Number(monto);
    const horasNum = Number(horas);

    if (!nombre || monto === "" || horas === "" || !estado) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (isNaN(montoNum) || isNaN(horasNum) || montoNum <= 0 || horasNum <= 0) {
      setError("Monto y horas deben ser números mayores que cero.");
      return;
    }

    setError("");

    mutate(
      {
        id: salario.id,
        data: {
          nombre,
          monto: montoNum,
          horas: horasNum,
          estado,
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
      title="Editar Salario"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>

      <Input
        label="Nombre Salario"
        size="sm"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Monto(valor)"
        size="sm"
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
      />

      <Input
        label="Horas de trabajo(día)"
        type="number"
        size="sm"
        value={horas}
        onChange={(e) => setHoras(e.target.value)}
        required
      />

      <Select
        label="Estado"
        size="sm"
        value={estado}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "activo" | "inactivo";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="activo">Activo</SelectItem>
        <SelectItem key="inactivo">Inactivo</SelectItem>
      </Select>
    </ModalComponent>
  );
};

export default EditarSalariosModal;

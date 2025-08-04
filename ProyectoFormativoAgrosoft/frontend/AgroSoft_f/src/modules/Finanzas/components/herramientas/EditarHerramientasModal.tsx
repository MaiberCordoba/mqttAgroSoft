import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchHerramientas } from '../../hooks/herramientas/usePatchHerramientas';
import { Herramientas } from '../../types';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetLotes } from '@/modules/Trazabilidad/hooks/lotes/useGetLotes';

interface EditarHerramientaModalProps {
  herramienta: Herramientas;
  onClose: () => void;
}

const EditarHerramientaModal: React.FC<EditarHerramientaModalProps> = ({ herramienta, onClose }) => {
  const [nombre, setNombre] = useState<string>(herramienta.nombre);
  const [descripcion, setDescripcion] = useState<string>(herramienta.descripcion);
  const [unidades, setUnidades] = useState<string>(herramienta.unidades.toString());
  const [precio, setPrecio] = useState<string>(herramienta.precio.toString());
  const [fk_Lote, setFk_Lote] = useState<number | undefined>(herramienta.fk_Lote);
  const [error, setError] = useState<string>("");

  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();
  const { mutate, isPending } = usePatchHerramientas();

  const handleSubmit = () => {
    // Validar que unidades y precio sean números válidos y no negativos
    const unidadesNum = Number(unidades);
    const precioNum = Number(precio);

    if (
      nombre.trim() === "" ||
      descripcion.trim() === "" ||
      isNaN(unidadesNum) ||
      isNaN(precioNum) ||
      unidadesNum < 0 ||
      precioNum < 0
    ) {
      setError("Por favor ingresa valores válidos y que no sean negativos en todos los campos.");
      return;
    }

    setError("");

    mutate(
      {
        id: herramienta.id,
        data: {
          nombre,
          descripcion,
          unidades: unidadesNum,
          precio: precioNum,
          fk_Lote,
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
      title="Editar Herramienta"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          onClick: handleSubmit,
        },
      ]}
    >
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <Input
        value={nombre}
        label="Nombre"
        size="sm"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Textarea
        value={descripcion}
        size="sm"
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <Input
        value={unidades}
        label="Unidades"
        size="sm"
        type="number"
        onChange={(e) => setUnidades(e.target.value)}
      />
      <Input
        value={precio}
        size="sm"
        label="Precio Unidad"
        type="number"
        onChange={(e) => setPrecio(e.target.value)}
      />

      {/* Selector de Lotes */}
      {isLoadingLotes ? (
        <p>Cargando lotes...</p>
      ) : (
        <Select
          label="Lote"
          size="sm"
          placeholder="Selecciona un lote"
          selectedKeys={fk_Lote ? [fk_Lote.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Lote(selectedKey ? Number(selectedKey) : undefined);
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote.id.toString()}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarHerramientaModal;

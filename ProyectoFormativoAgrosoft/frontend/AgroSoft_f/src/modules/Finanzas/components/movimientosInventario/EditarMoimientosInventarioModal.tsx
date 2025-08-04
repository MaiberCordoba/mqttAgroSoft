import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Input, Select, SelectItem } from '@heroui/react';
import { MovimientoInventario } from '../../types';
import { useGetHerramientas } from '../../hooks/herramientas/useGetHerramientas';
import { usePatchMovimientoInventario } from '../../hooks/movimientoInventario/usePatchMovimientos';
import { useGetInsumos } from '../../hooks/insumos/useGetInsumos';

interface EditarMovimientoInventarioModalProps {
  movimiento: MovimientoInventario;
  onClose: () => void;
}

const EditarMovimientoInventarioModal: React.FC<EditarMovimientoInventarioModalProps> = ({
  movimiento,
  onClose,
}) => {
  const [tipo, setTipo] = useState<'entrada' | 'salida'>(movimiento.tipo);
  const [unidades, setUnidades] = useState<string>(movimiento.unidades.toString());
  const [fk_Herramienta, setFk_Herramienta] = useState<number | null>(movimiento.fk_Herramienta || null);
  const [fkInsumo, setFkInsumo] = useState<number | null>(movimiento.fk_Insumo || null);
  const [error, setError] = useState("");

  const { data: herramientas = [] } = useGetHerramientas();
  const { data: insumos = [] } = useGetInsumos();
  const { mutate, isPending } = usePatchMovimientoInventario();

  const handleSubmit = () => {
    const cantidad = Number(unidades);

    if (isNaN(cantidad) || cantidad <= 0) {
      setError("Por favor, ingresa una cantidad válida mayor a 0.");
      return;
    }

    if (fkInsumo && fk_Herramienta) {
      setError("Solo se puede registrar un movimiento para insumo o herramienta, no ambos.");
      return;
    }

    setError("");
    mutate(
      {
        id: movimiento.id,
        data: {
          tipo,
          unidades: cantidad,
          fk_Herramienta,
          fk_Insumo: fkInsumo,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Movimiento de Inventario"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>

      <Select
        label="Tipo de Movimiento"
        size="sm"
        selectedKeys={[tipo]}
        onSelectionChange={(keys) => setTipo(keys.values().next().value as 'entrada' | 'salida')}
      >
        <SelectItem key="entrada">Entrada</SelectItem>
        <SelectItem key="salida">Salida</SelectItem>
      </Select>

      <Input
        label="Unidades"
        type="text"
        size="sm"
        value={unidades}
        onChange={(e) => setUnidades(e.target.value)}
        required
      />

      <Select
        label="Herramienta"
        size="sm"
        placeholder="Selecciona una herramienta"
        selectedKeys={fk_Herramienta ? [fk_Herramienta.toString()] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setFk_Herramienta(key ? Number(key) : null);
          setFkInsumo(null); // Desactiva insumo si se selecciona herramienta
        }}
      >
        {herramientas.map((h) => (
          <SelectItem key={h.id.toString()}>{h.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Insumo"
        size="sm"
        placeholder="Selecciona un insumo"
        selectedKeys={fkInsumo ? [fkInsumo.toString()] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          setFkInsumo(key ? Number(key) : null);
          setFk_Herramienta(null); // Desactiva herramienta si se selecciona insumo
        }}
      >
        {insumos.map((uso) => (
          <SelectItem key={uso.id.toString()}>
            {uso.nombre}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarMovimientoInventarioModal;

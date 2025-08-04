import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { usePatchInsumos } from '../../hooks/insumos/usePatchInsumos';
import { Insumos } from '../../types';
import { useGetUnidadesMedida } from '@/modules/Finanzas/hooks/unidadesMedida/useGetUnidadesMedida';

interface EditarInsumoModalProps {
  insumo: Insumos;
  onClose: () => void;
}

const EditarInsumoModal: React.FC<EditarInsumoModalProps> = ({ insumo, onClose }) => {
  const [nombre, setNombre] = useState(insumo.nombre);
  const [descripcion, setDescripcion] = useState(insumo.descripcion);
  const [precio, setPrecio] = useState<string>(
    insumo.precio !== null && insumo.precio !== undefined ? insumo.precio.toString() : ''
  );
  const [compuestoActivo, setCompuestoActivo] = useState(insumo.compuestoActivo);
  const [contenido, setContenido] = useState<string>(
    insumo.contenido !== null && insumo.contenido !== undefined ? insumo.contenido.toString() : ''
  );
  const [unidades, setUnidades] = useState<string>(
    insumo.unidades !== null && insumo.unidades !== undefined ? insumo.unidades.toString() : ''
  );
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(insumo.fk_UnidadMedida || null);
  const [fichaTecnica, setFichaTecnica] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: unidadesMedida, isLoading: isLoadingUnidad } = useGetUnidadesMedida();
  const { mutate, isPending } = usePatchInsumos();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !precio || !contenido || !unidades || !fk_UnidadMedida) {
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('compuestoActivo', compuestoActivo);
    formData.append('contenido', contenido);
    formData.append('unidades', unidades);
    formData.append('fk_UnidadMedida', fk_UnidadMedida.toString());
    if (fichaTecnica) {
      formData.append('fichaTecnica', fichaTecnica);
    }

    mutate(
      {
        id: insumo.id,
        data: formData,
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
      title="Editar Insumo"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Nombre Insumo"
        value={nombre}
        size="sm"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        label="Descripción"
        size="sm"
        value={descripcion}
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <Input
        label="Precio unidad insumo"
        size="sm"
        value={precio}
        type="text"
        onChange={(e) => {
          const valor = e.target.value;
          if (/^\d*\.?\d*$/.test(valor)) setPrecio(valor);
        }}
        required
      />
      <Input
        label="Compuesto Activo"
        size="sm"
        value={compuestoActivo}
        type="text"
        onChange={(e) => setCompuestoActivo(e.target.value)}
        required
      />
      <Input
        label="Unidades compradas"
        value={unidades}
        size="sm"
        type="text"
        onChange={(e) => {
          const valor = e.target.value;
          if (/^\d*$/.test(valor)) setUnidades(valor);
        }}
        required
      />
      <Input
        label="Contenido del insumo"
        size="sm"
        value={contenido}
        type="text"
        onChange={(e) => {
          const valor = e.target.value;
          if (/^\d*\.?\d*$/.test(valor)) setContenido(valor);
        }}
        required
      />

      {isLoadingUnidad ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de Medida"
          size="sm"
          placeholder="Selecciona una unidad"
          selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(unidadesMedida || []).map((unidad) => (
            <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <div className="mt-4">
        <Button
          type="submit"
          variant="solid"
          onPress={() => document.getElementById('imagenFichaTecnica')?.click()}
        >
          Ficha técnica
        </Button>
        <span className="flex-1 p-3">Cargar ficha técnica</span>
        <input
          id="imagenFichaTecnica"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFichaTecnica(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Ficha Técnica" className="w-full max-w-xs" />
        </div>
      )}
    </ModalComponent>
  );
};

export default EditarInsumoModal;

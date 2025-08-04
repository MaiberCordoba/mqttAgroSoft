import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';
import { usePatchAfecciones } from '../../hooks/afecciones/usePatchAfecciones';
import { Afecciones } from '../../types';
import { Button, Image, Input, Textarea, Select, SelectItem } from '@heroui/react';
import { useGetTipoAfecciones } from '../../hooks/tiposAfecciones/useGetTipoAfecciones'; 

interface EditarAfeccionModalProps {
  afeccion: Afecciones;
  onClose: () => void;
}

const EditarAfeccionModal: React.FC<EditarAfeccionModalProps> = ({ afeccion, onClose }) => {
  const [nombre, setNombre] = useState<string>(afeccion.nombre);
  const [descripcion, setDescripcion] = useState<string>(afeccion.descripcion);
  const [fk_Tipo, setFk_Tipo] = useState<number>(afeccion.tipoPlaga?.id || 0);
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetTipoAfecciones();
  const { mutate, isPending } = usePatchAfecciones();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("fk_Tipo", fk_Tipo.toString());
    if (img) {
      formData.append("img", img);
    }

    mutate(
      {
        id: afeccion.id,
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
      title="Editar Afección"
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
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        size="sm"
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
        size="sm"
      />

      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de afectacion"
          placeholder="Selecciona un tipo de afectacion"
          selectedKeys={[fk_Tipo.toString()]}
          size="sm"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Tipo(Number(selectedKey));
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      <div className="mt-4">
        <Button
          type="submit"
          variant="solid"
          onPress={() => document.getElementById("imagen")?.click()}
        >
          Seleccionar imagen
        </Button>

        <Input 
          label="Imagen"
          id="imagen" 
          type="file" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImagen(file);
              setPreview(URL.createObjectURL(file!)); 
            }
          }} 
          className="hidden"
        />
      </div>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Vista previa"
            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
          />
        </div>
      )}
    </ModalComponent>
  );
};

export default EditarAfeccionModal;

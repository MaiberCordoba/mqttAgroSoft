import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTipoAfecciones } from "../../hooks/tiposAfecciones/usePatchTipoAfecciones";
import { Button, Image, Input, Textarea } from "@heroui/react";
import { TiposAfecciones } from "../../types";

interface EditarTipoAfeccionesModalProps {
  tipoAfeccion: TiposAfecciones;
  onClose: () => void;
}


const EditarTipoAfeccionModal: React.FC<EditarTipoAfeccionesModalProps> = ({ tipoAfeccion, onClose }) => {
  const [nombre, setNombre] = useState<string>(tipoAfeccion.nombre);
  const [descripcion, setDescripcion] = useState<string>(tipoAfeccion.descripcion);
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = usePatchTipoAfecciones();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (img) {
      formData.append("img", img);
    }
  
    mutate(
      {
        id: tipoAfeccion.id,
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
      title="Editar Tipo de Afección"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
    <Input label="Nombre"  size="sm" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
    
    <Textarea label="Descripción"   size="sm" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
    
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
          className="w-24  h-24 object-cover rounded-lg border border-gray-300"
        />
      </div>
    )}
    
    </ModalComponent>
  );
};

export default EditarTipoAfeccionModal;

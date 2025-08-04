import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTiposEspecie } from "../../hooks/tiposEspecie/usePatchTiposEspecie";
import { TiposEspecie } from "../../types";
import { Input, Textarea, Button } from "@heroui/react";
import { addToast } from "@heroui/toast"; // ⬅️ Importación del toast

interface EditarTiposEspecieModalProps {
  especie: TiposEspecie;
  onClose: () => void;
}

const EditarTiposEspecieModal: React.FC<EditarTiposEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(especie.img);

  const { mutate, isPending } = usePatchTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (img) {
      formData.append("img", img);
    }

    mutate(
      { id: especie.id, data: formData },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible actualizar la información.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Tipo de Especie"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
        required
        size="sm"
      />

      <div className="mt-4">
        <Button
          type="button"
          variant="solid"
          onPress={() => document.getElementById("imgInput")?.click()}
        >
          Cambiar imagen
        </Button>

        <input
          id="imgInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImg(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Vista previa"
            className="w-48 h-48 object-cover rounded-lg border border-gray-300"
          />
        </div>
      )}
    </ModalComponent>
  );
};

export default EditarTiposEspecieModal;

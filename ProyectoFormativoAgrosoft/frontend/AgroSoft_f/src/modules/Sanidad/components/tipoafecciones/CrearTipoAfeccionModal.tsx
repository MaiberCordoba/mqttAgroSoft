import { useState, useEffect } from "react";
import { usePostTipoAfeccion } from "../../hooks/tiposAfecciones/usePostTipoAfecciones";
import ModalComponent from "@/components/Modal";
import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface CrearTipoAfeccionModalProps {
  onClose: () => void;
  onCreate: (nuevoTipo: { id: number; nombre: string }) => void;
}

export const CrearTipoAfeccionModal = ({ onClose, onCreate }: CrearTipoAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = usePostTipoAfeccion();

  useEffect(() => {
    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [img]);

  const handleSubmit = () => {
    if (!nombre.trim() || !descripcion.trim() || !img) {
      addToast({
        title: "Error",
        description: "Rellene todos los campos obligatorios",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("img", img);

    mutate(formData, {
      onSuccess: (data) => {
        onCreate({ id: data.id, nombre: data.nombre });
        onClose();
        setNombre("");
        setDescripcion("");
        setImagen(null);
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de tipo de  afectaciones"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Nombre"
        type="text"
        size="sm"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
        size="sm"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      <div className="mt-4">
        <Button
          type="submit"
          variant="solid"
          onPress={() => document.getElementById("imagenInput")?.click()}
        >
          Seleccionar imagen
        </Button>

        <input
          id="imagenInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImagen(file);
            } else {
              setImagen(null);
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
            className="w-48 h-48 object-cover rounded-lg border border-gray-300"
          />
        </div>
      )}
    </ModalComponent>
  );
};

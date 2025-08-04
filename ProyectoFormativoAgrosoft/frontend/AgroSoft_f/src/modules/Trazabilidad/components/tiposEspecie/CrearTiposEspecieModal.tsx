import { useState } from "react";
import { usePostTiposEspecie } from "../../hooks/tiposEspecie/usePostTiposEspecie";
import ModalComponent from "@/components/Modal";
import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";

interface CrearTiposEspecieModalProps {
  onClose: () => void;
  onCreate: (nuevoTipo: { id: number }) => void;
}

export const CrearTiposEspecieModal = ({ onClose, onCreate }: CrearTiposEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate, isPending } = usePostTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !img) {
      addToast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos.",
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
        addToast({
          title: "Creación exitosa",
          description: "Nuevo tipo de especie registrado con éxito",
          color: "success",
        });

        try {
          onCreate(data);
        } catch (err) {
          console.error("Error en onCreate:", err);
        }

        setNombre("");
        setDescripcion("");
        setImg(null);
        setPreview(null);
        onClose();
      },
      onError: (error) => {
        console.error("Error al crear el tipo de especie:", error);
        addToast({
          title: "Error al crear tipo de especie",
          description: "No fue posible registrar el tipo de especie",
          color: "danger",
        });
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Tipos de Especie"
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
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        size="sm"
      />

      <div className="mt-4">
        <Button
          type="button"
          variant="solid"
          onPress={() => document.getElementById("imgTipoEspecieInput")?.click()}
        >
          Seleccionar imagen
        </Button>

        <input
          id="imgTipoEspecieInput"
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

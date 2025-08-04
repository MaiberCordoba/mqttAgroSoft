import { useState } from "react";
import { usePostTiposDesechos } from "../../hooks/tiposDesechos/usePostTiposDesechos";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { TiposDesechos } from "../../types";
import { addToast } from "@heroui/toast";

interface CrearTiposDesechosModalProps {
  onClose: () => void;
  onCreate: (nuevoTipoDesecho : TiposDesechos) => void
}

export const CrearTiposDesechosModal = ({ onClose }: CrearTiposDesechosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error,setError] = useState("")

  const { mutate, isPending } = usePostTiposDesechos();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos.",
        color:"danger"
      })
      return;
    }
    setError("")
    mutate(
      {id:0 ,nombre, descripcion }, // Envía el ID del tipo de plaga
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setError("")
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de tipo de desecho"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant:"light",
          onClick: handleSubmit
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
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
    </ModalComponent>
  );
};
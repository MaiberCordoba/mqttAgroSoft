import { useState } from "react";
import { usePostUnidadesTiempo } from "../../hooks/unidadesTiempo/usePostUnidadesTiempo";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { UnidadesTiempo } from "../../types";
import { addToast } from "@heroui/toast";

interface CrearUnidadesTiempoModalProps {
  onClose: () => void;
  onCreate: (nuevaUnidadTiempo : UnidadesTiempo) => void
}


export const CrearUnidadesTiempoModal = ({
  onClose,
}: CrearUnidadesTiempoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [equivalenciaMinutos, setEquivalenciaMinutos] = useState(0);
  const [error,setError] = useState("")

  const { mutate, isPending } = usePostUnidadesTiempo();

  const handleSubmit = () => {
    if (!nombre  || !equivalenciaMinutos) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos.",
        color:"danger"
      })
      return;
    }
    if (equivalenciaMinutos < 0){
      addToast({
        title:"Valores invalidos",
        description:"Por favor, ingresa valores positivos.",
        color:"danger"
      })
      return
    }
    setError("")
    mutate(
      { id:0,nombre, equivalenciaMinutos },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setEquivalenciaMinutos(0);
          setError("")
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de unidad de tiempo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input label="Nombre" type="text" size="sm" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <Input label="equivalencia Minutos" size="sm" type="number" value={equivalenciaMinutos.toString()} onChange={(e) => setEquivalenciaMinutos(Number(e.target.value))} required />
    </ModalComponent>
  );
};

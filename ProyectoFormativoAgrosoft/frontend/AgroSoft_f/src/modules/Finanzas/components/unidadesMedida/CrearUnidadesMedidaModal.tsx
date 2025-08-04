import { useState } from "react";
import { usePostUnidadesMedida } from "../../hooks/unidadesMedida/usePostUnidadesMedida";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { UnidadesMedida } from "../../types";
import { addToast } from "@heroui/toast";

interface CrearUnidadesMedidaModalProps {
  onClose: () => void;
  onCreate: (nuevaUnidadMedida : UnidadesMedida) => void
}

export const CrearUnidadesMedidaModal = ({ onClose, }: CrearUnidadesMedidaModalProps) => {
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [tipo, setTipo] = useState<"MASA" | "VOLUMEN" | "">("");
  const [equivalenciabase, setEquivalenciabase] = useState(0);
  const  [error,setError] = useState("")

  const { mutate, isPending } = usePostUnidadesMedida();

  const handleSubmit = () => {
    if (!nombre || !abreviatura || !tipo || equivalenciabase == 0) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos.",
        color:"danger"
      })
      return;
    }
    if (equivalenciabase < 0) {
      addToast({
        title:"Valores invalidos",
        description:"Por favor, ingresa valores positivos.",
        color:"danger"
      })
      return;
    }
    setError("")

    mutate(
      { id:0,nombre, abreviatura, tipo, equivalenciabase },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setAbreviatura("");
          setTipo("");
          setEquivalenciabase(0);
          setError("")
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de unidad de medida"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input
        label="Nombre"
        size="sm"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Input
        label="Abreviatura"
        type="text"
        size="sm"
        value={abreviatura}
        onChange={(e) => setAbreviatura(e.target.value)}
        required
      />
      <Select
        label="Tipo de unidad"
        size="sm"
        value={tipo}
        onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as "MASA" | "VOLUMEN";
            setTipo(selectedKey);
          }}
        required
      >
        <SelectItem key="MASA">Masa</SelectItem>
        <SelectItem key="VOLUMEN">Volumen</SelectItem>
      </Select>
      <Input
        size="sm"
        label="Equivalencia (gramos)/(cc)"
        type="number"
        value={equivalenciabase.toString()}
        onChange={(e) => setEquivalenciabase(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};

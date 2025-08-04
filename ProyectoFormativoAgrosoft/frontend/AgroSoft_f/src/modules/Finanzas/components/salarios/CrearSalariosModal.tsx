import { useState } from "react";
import { usePostSalario } from "../../hooks/salarios/usePostSalarios";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { Salarios } from "../../types";
import { addToast } from "@heroui/toast";

interface CrearSalariosModalProps {
  onClose: () => void;
  onCreate: (nuevoSalario: Salarios) => void;
}

export const CrearSalariosModal = ({ onClose }: CrearSalariosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState<string>("");
  const [horas, setHoras] = useState<string>("");
  const [estado, setEstado] = useState<"activo" | "inactivo" | "">("");
  const [error, setError] = useState("");

  const { mutate, isPending } = usePostSalario();

  const handleSubmit = () => {
    const montoNum = Number(monto);
    const horasNum = Number(horas);

    if (!nombre || monto === "" || horas === "" || !estado) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos.",
        color:"danger"
      })
      return;
    }

    if (isNaN(montoNum) || isNaN(horasNum) || montoNum <= 0 || horasNum <= 0) {
      addToast({
        title:"Valores invalidos",
        description:"Por favor, ingresa valores positivos.",
        color:"danger"
      })
      return;
    }

    setError("");

    mutate(
      {
        id: 0,
        nombre,
        monto: montoNum,
        horas: horasNum,
        estado,
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setMonto("");
          setHoras("");
          setEstado("");
          setError("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Salarios"
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
        label="Nombre Salario"
        size="sm"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Monto(valor)"
        size="sm"
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
      />

      <Input
        label="Horas de trabajo(día)"
        size="sm"
        type="number"
        value={horas}
        onChange={(e) => setHoras(e.target.value)}
        required
      />

      <Select
        label="Estado"
        size="sm"
        value={estado}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "activo" | "inactivo";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="activo">Activo</SelectItem>
        <SelectItem key="inactivo">Inactivo</SelectItem>
      </Select>
    </ModalComponent>
  );
};

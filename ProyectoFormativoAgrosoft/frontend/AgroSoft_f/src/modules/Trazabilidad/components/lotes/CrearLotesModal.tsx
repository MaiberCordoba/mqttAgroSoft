import { useState } from "react";
import { usePostLotes } from "../../hooks/lotes/usePostLotes";
import ModalComponent from "@/components/Modal";
import { Input, Switch } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Lotes } from "../../types";

interface CrearLoteModalProps {
  onClose: () => void;
  onCreate: (nuevoLote: Lotes) => void;
}

export const CrearLoteModal = ({ onClose, onCreate }: CrearLoteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [latI1, setLatI1] = useState<string>("");
  const [longI1, setLongI1] = useState<string>("");
  const [latS1, setLatS1] = useState<string>("");
  const [longS1, setLongS1] = useState<string>("");
  const [latI2, setLatI2] = useState<string>("");
  const [longI2, setLongI2] = useState<string>("");
  const [latS2, setLatS2] = useState<string>("");
  const [longS2, setLongS2] = useState<string>("");
  const [estado, setEstado] = useState<string>("di"); // "di" = disponible, "oc" = ocupado

  const { mutate, isPending } = usePostLotes();

  const handleEstadoSwitchChange = (isSelected: boolean) => {
    setEstado(isSelected ? "di" : "oc");
  };

  const handleSubmit = () => {
    const parsedLatI1 = parseFloat(latI1.replace(",", "."));
    const parsedLongI1 = parseFloat(longI1.replace(",", "."));
    const parsedLatS1 = parseFloat(latS1.replace(",", "."));
    const parsedLongS1 = parseFloat(longS1.replace(",", "."));
    const parsedLatI2 = parseFloat(latI2.replace(",", "."));
    const parsedLongI2 = parseFloat(longI2.replace(",", "."));
    const parsedLatS2 = parseFloat(latS2.replace(",", "."));
    const parsedLongS2 = parseFloat(longS2.replace(",", "."));

    const campos = [
      parsedLatI1, parsedLongI1,
      parsedLatS1, parsedLongS1,
      parsedLatI2, parsedLongI2,
      parsedLatS2, parsedLongS2,
    ];

    const camposInvalidos = campos.some((val) => isNaN(val));

    if (!nombre || camposInvalidos) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor completa el nombre y asegúrate de que todos los campos de coordenadas sean válidos.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        latI1: parsedLatI1,
        longI1: parsedLongI1,
        latS1: parsedLatS1,
        longS1: parsedLongS1,
        latI2: parsedLatI2,
        longI2: parsedLongI2,
        latS2: parsedLatS2,
        longS2: parsedLongS2,
        estado: estado === "di",
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          setNombre("");
          setDescripcion("");
          setLatI1("");
          setLongI1("");
          setLatS1("");
          setLongS1("");
          setLatI2("");
          setLongI2("");
          setLatS2("");
          setLongS2("");
          setEstado("di");
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible registrar el lote.",
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
      title="Registro de Lote"
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
        size="sm"
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Input label="Lat. Inf. Izquierda" type="text" inputMode="decimal" value={latI1} onChange={(e) => setLatI1(e.target.value)} size="sm" />
        <Input label="Lon. Inf. Izquierda" type="text" inputMode="decimal" value={longI1} onChange={(e) => setLongI1(e.target.value)} size="sm" />
        <Input label="Lat. Sup. Izquierda" type="text" inputMode="decimal" value={latS1} onChange={(e) => setLatS1(e.target.value)} size="sm" />
        <Input label="Lon. Sup. Izquierda" type="text" inputMode="decimal" value={longS1} onChange={(e) => setLongS1(e.target.value)} size="sm" />
        <Input label="Lat. Inf. Derecha" type="text" inputMode="decimal" value={latI2} onChange={(e) => setLatI2(e.target.value)} size="sm" />
        <Input label="Lon. Inf. Derecha" type="text" inputMode="decimal" value={longI2} onChange={(e) => setLongI2(e.target.value)} size="sm" />
        <Input label="Lat. Sup. Derecha" type="text" inputMode="decimal" value={latS2} onChange={(e) => setLatS2(e.target.value)} size="sm" />
        <Input label="Lon. Sup. Derecha" type="text" inputMode="decimal" value={longS2} onChange={(e) => setLongS2(e.target.value)} size="sm" />
      </div>

      <div className="mt-4">
        <Switch
          size="sm"
          isSelected={estado === "di"}
          onValueChange={handleEstadoSwitchChange}
          color="success"
        >
          {estado === "di" ? "Disponible" : "Ocupado"}
        </Switch>
      </div>
    </ModalComponent>
  );
};

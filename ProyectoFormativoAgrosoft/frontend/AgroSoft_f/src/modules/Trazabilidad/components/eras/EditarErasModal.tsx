import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEras } from "../../hooks/eras/usePatchEras";
import { Eras } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import { addToast } from "@heroui/toast";

interface EditarEraModalProps {
  era: Eras;
  onClose: () => void;
}

const EditarEraModal: React.FC<EditarEraModalProps> = ({ era, onClose }) => {
  const [fk_lote, setFkLoteId] = useState<number | null>(era.fk_lote?.id ?? null);
  const [tipo, setTipo] = useState(era.tipo ?? "");

  const [latI1, setLatI1] = useState<number | null>(era.latI1 ?? null);
  const [longI1, setLongI1] = useState<number | null>(era.longI1 ?? null);
  const [latS1, setLatS1] = useState<number | null>(era.latS1 ?? null);
  const [longS1, setLongS1] = useState<number | null>(era.longS1 ?? null);
  const [latI2, setLatI2] = useState<number | null>(era.latI2 ?? null);
  const [longI2, setLongI2] = useState<number | null>(era.longI2 ?? null);
  const [latS2, setLatS2] = useState<number | null>(era.latS2 ?? null);
  const [longS2, setLongS2] = useState<number | null>(era.longS2 ?? null);

  const { mutate, isPending } = usePatchEras();
  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();

  const handleSubmit = () => {
    if (
      fk_lote === null ||
      tipo.trim() === "" ||
      latI1 === null ||
      longI1 === null ||
      latS1 === null ||
      longS1 === null ||
      latI2 === null ||
      longI2 === null ||
      latS2 === null ||
      longS2 === null
    ) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: era.id ?? 0,
        data: {
          fk_lote,
          tipo,
          latI1,
          longI1,
          latS1,
          longS1,
          latI2,
          longI2,
          latS2,
          longS2,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible actualizar la era.",
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
      title="Editar Era"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      {isLoadingLotes ? (
        <p>Cargando lotes...</p>
      ) : (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          size="sm"
          selectedKeys={fk_lote !== null ? new Set([fk_lote.toString()]) : new Set()}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkLoteId(Number(selectedKey) || null);
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote.id?.toString()}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <Input
        label="Tipo"
        size="sm"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Input
          label="Lat. Inf. Izquierda"
          type="number"
          value={(latI1 ?? "").toString()}
          onChange={(e) => setLatI1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Inf. Izquierda"
          type="number"
          value={(longI1 ?? "").toString()}
          onChange={(e) => setLongI1(Number(e.target.value))}
          size="sm"
        />

        <Input
          label="Lat. Sup. Izquierda"
          type="number"
          value={(latS1 ?? "").toString()}
          onChange={(e) => setLatS1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Sup.Izquierda"
          type="number"
          value={(longS1 ?? "").toString()}
          onChange={(e) => setLongS1(Number(e.target.value))}
          size="sm"
        />

        <Input
          label="Lat. Inf. Derecha"
          type="number"
          value={(latI2 ?? "").toString()}
          onChange={(e) => setLatI2(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Inf. Derecha"
          type="number"
          value={(longI2 ?? "").toString()}
          onChange={(e) => setLongI2(Number(e.target.value))}
          size="sm"
        />

        <Input
          label="Lat. Sup. Derecha"
          type="number"
          value={(latS2 ?? "").toString()}
          onChange={(e) => setLatS2(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Sup. Derecha"
          type="number"
          value={(longS2 ?? "").toString()}
          onChange={(e) => setLongS2(Number(e.target.value))}
          size="sm"
        />
      </div>
    </ModalComponent>
  );
};

export default EditarEraModal;

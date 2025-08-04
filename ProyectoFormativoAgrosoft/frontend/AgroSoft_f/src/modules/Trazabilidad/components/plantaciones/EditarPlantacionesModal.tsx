import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchPlantaciones } from "../../hooks/plantaciones/usePatchPlantaciones";
import { Plantaciones } from "../../types";
import { Select, SelectItem, Input } from "@heroui/react";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
import { useGetEras } from "../../hooks/eras/useGetEras";
import { addToast } from "@heroui/toast";

interface EditarPlantacionModalProps {
  plantacion: Plantaciones;
  onClose: () => void;
}

const EditarPlantacionModal: React.FC<EditarPlantacionModalProps> = ({
  plantacion,
  onClose,
}) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(plantacion.fk_Cultivo ?? null);
  const [fk_semillero, setFk_semillero] = useState<number | null>(plantacion.fk_semillero ?? null);
  const [fk_Era, setFk_Era] = useState<number | null>(plantacion.fk_Era ?? null);
  const [unidades, setUnidades] = useState<number>(plantacion.unidades ?? 0);
  const [fechaSiembra, setFechaSiembra] = useState<string>(
    plantacion.fechaSiembra?.slice(0, 10) ?? ""
  );

  const { mutate, isPending } = usePatchPlantaciones();
  const { data: cultivos = [] } = useGetCultivos();
  const { data: semilleros = [] } = useGetSemilleros();
  const { data: eras = [] } = useGetEras();

  const handleSubmit = () => {
    const seleccionInvalida =
      (!fk_Cultivo && !fk_semillero) || (fk_Cultivo && fk_semillero);

    if (seleccionInvalida || !fk_Era || !unidades || !fechaSiembra) {
      addToast({
        title: "Campos obligatorios",
        description:
          "Debes seleccionar solo un Cultivo o un Semillero, una Era, y completar unidades y fecha.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: plantacion.id,
        data: {
          fk_Cultivo,
          fk_semillero,
          fk_Era,
          unidades,
          fechaSiembra,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No se pudo actualizar la plantación.",
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
      title="Editar Plantación"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Select Cultivo */}
      <Select
        label="Cultivo"
        placeholder="Selecciona un cultivo"
        size="sm"
        selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          if (selected) {
            setFk_Cultivo(Number(selected));
            setFk_semillero(null);
          } else {
            setFk_Cultivo(null);
          }
        }}
      >
        <SelectItem key="">Ninguno</SelectItem>
        {cultivos.map((cultivo) => (
          <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
        ))}
      </Select>

      {/* Select Semillero */}
      <Select
        className="mt-4"
        label="Semillero"
        placeholder="Selecciona un semillero"
        size="sm"
        selectedKeys={fk_semillero ? [fk_semillero.toString()] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          if (selected) {
            setFk_semillero(Number(selected));
            setFk_Cultivo(null);
          } else {
            setFk_semillero(null);
          }
        }}
      >
        <SelectItem key="">Ninguno</SelectItem>
        {semilleros.map((semillero) => (
          <SelectItem key={semillero.id.toString()}>
            {`Semillero #${semillero.id} - ${semillero.unidades} unidades`}
          </SelectItem>
        ))}
      </Select>

      {/* Input Unidades */}
      <Input
        className="mt-4"
        label="Unidades"
        type="number"
        size="sm"
        value={unidades.toString()}
        onChange={(e) => setUnidades(Number(e.target.value))}
      />

      {/* Input Fecha Siembra */}
      <Input
        className="mt-2"
        label="Fecha Siembra"
        type="date"
        size="sm"
        value={fechaSiembra}
        onChange={(e) => setFechaSiembra(e.target.value)}
      />

      {/* Select Era */}
      <Select
        className="mt-4"
        label="Era"
        placeholder="Selecciona una era"
        size="sm"
        selectedKeys={fk_Era ? [fk_Era.toString()] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          setFk_Era(Number(selected));
        }}
      >
        {eras.map((era) => (
          <SelectItem key={era.id.toString()}>
            {`Era ${era.tipo} en ${era.Lote?.nombre || "sin lote"}`}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarPlantacionModal;

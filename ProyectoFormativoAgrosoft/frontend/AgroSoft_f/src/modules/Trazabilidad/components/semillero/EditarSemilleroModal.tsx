import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchSemilleros } from "../../hooks/semilleros/usePatchSemilleros";
import { Semillero } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { addToast } from "@heroui/toast";

interface EditarSemilleroModalProps {
  semillero: Semillero;
  onClose: () => void;
}

const EditarSemilleroModal: React.FC<EditarSemilleroModalProps> = ({
  semillero,
  onClose,
}) => {
  const [unidades, setUnidades] = useState<number>(semillero.unidades);
  const [fechasiembra, setFechaSiembra] = useState<string>(semillero.fechasiembra);
  const [fechaestimada, setFechaEstimada] = useState<string>(semillero.fechaestimada);
  const [fk_especie, setFk_Especie] = useState<number>(semillero.cultivo.fk_Especie);

  const { mutate, isPending } = usePatchSemilleros();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    if (
      unidades <= 0 ||
      !fechasiembra.trim() ||
      !fechaestimada.trim() ||
      !fk_especie
    ) {
      addToast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: semillero.id,
        data: {
          unidades,
          fechasiembra,
          fechaestimada,
          fk_especie,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Actualización exitosa",
            description: "El semillero fue actualizado correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error al actualizar",
            description: "No fue posible actualizar el semillero.",
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
      title="Editar Semillero"
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
        value={unidades.toString()}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />
      <Input
        value={fechasiembra}
        label="Fecha de Siembra"
        type="date"
        onChange={(e) => setFechaSiembra(e.target.value)}
      />
      <Input
        value={fechaestimada}
        label="Fecha Estimada"
        type="date"
        onChange={(e) => setFechaEstimada(e.target.value)}
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          selectedKeys={fk_especie ? [fk_especie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Especie(Number(selectedKey));
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarSemilleroModal;

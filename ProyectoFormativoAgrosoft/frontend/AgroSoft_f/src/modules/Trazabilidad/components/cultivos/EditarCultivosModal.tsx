import React, { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCultivos } from "../../hooks/cultivos/usePatchCultivos";
import { Cultivo } from "../../types";
import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { addToast } from "@heroui/toast";

interface EditarCultivoModalProps {
  cultivo: Cultivo;
  onClose: () => void;
}

const EditarCultivoModal: React.FC<EditarCultivoModalProps> = ({
  cultivo,
  onClose,
}) => {

  const [nombre, setNombre] = useState<string>("");
  const [fk_EspecieId, setFk_EspecieId] = useState<number | null>(null);
  const [selectedSpeciesKeys, setSelectedSpeciesKeys] = useState<Set<string>>(
    new Set()
  );
  const [activo, setActivo] = useState<boolean>(true);
  const { mutate, isPending } = usePatchCultivos();
  const {
    data: especies,
    isLoading: isLoadingEspecies,
  } = useGetEspecies();

  useEffect(() => {
    if (!cultivo) return;
    setNombre(cultivo.nombre ?? "");

    const especieId =
      typeof cultivo.fk_Especie === "number"
        ? cultivo.fk_Especie
        : cultivo.fk_Especie?.id;

    setFk_EspecieId(especieId ?? null);

    setActivo(!!cultivo.activo);
  }, [cultivo]);

  useEffect(() => {
    if (!isLoadingEspecies && fk_EspecieId !== null) {
      setSelectedSpeciesKeys(new Set([String(fk_EspecieId)]));
    }
  }, [isLoadingEspecies, fk_EspecieId]);

  const handleSubmit = () => {
    if (!nombre.trim() || !fk_EspecieId || cultivo.id === undefined) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor completa el nombre y selecciona una especie.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: cultivo.id,
        data: { nombre, fk_Especie: fk_EspecieId, activo },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Actualización exitosa",
            description: "El cultivo fue actualizado correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error al actualizar",
            description: "No fue posible actualizar el cultivo.",
            color: "danger",
          });
        },
      }
    );
  };

  /* ---------------------------- render ---------------------------- */
  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Cultivo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Nombre */}
      <Input
        value={nombre}
        label="Nombre del Cultivo"
        size="sm"
        onChange={(e) => setNombre(e.target.value)}
      />

      {/* Especie */}
      {isLoadingEspecies ? (
        <p>Cargando especies…</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          size="sm"
          selectedKeys={selectedSpeciesKeys}
          onSelectionChange={(keys) => {
            const id = Array.from(keys)[0];
            if (id) setFk_EspecieId(Number(id));
          }}
        >
          {(especies || []).map((esp) => (
            <SelectItem key={esp.id.toString()}>{esp.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Activo / Inactivo */}
      <div className="flex items-center gap-4 mt-4">
        <Switch
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          color="success"
        >
          {activo ? "Activo" : "Inactivo"}
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarCultivoModal;

import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { usePatchUnidadesMedida } from "../../hooks/unidadesMedida/usePatchUnidadesMedida";
import { UnidadesMedida } from "../../types";

interface EditarUnidadesMedidaModalProps {
  unidadMedida: UnidadesMedida;
  onClose: () => void;
}

const EditarUnidadesMedidaModal: React.FC<EditarUnidadesMedidaModalProps> = ({
  unidadMedida,
  onClose,
}) => {
  const [nombre, setNombre] = useState(unidadMedida.nombre);
  const [abreviatura, setAbreviatura] = useState(unidadMedida.abreviatura);
  const [tipo, setTipo] = useState<"MASA" | "VOLUMEN">(unidadMedida.tipo);
  const [equivalenciabase, setEquivalenciabase] = useState(unidadMedida.equivalenciabase);

  const { mutate, isPending } = usePatchUnidadesMedida();

  const handleSubmit = () => {
    mutate(
      {
        id: unidadMedida.id,
        data: {
          nombre,
          abreviatura,
          tipo,
          equivalenciabase,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Unidad de Medida"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        size="sm"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Input
        value={abreviatura}
        label="Abreviatura"
        size="sm"
        type="text"
        onChange={(e) => setAbreviatura(e.target.value)}
      />
      <Select
        label="Tipo de unidad"
        size="sm"
        value={tipo}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as "MASA" | "VOLUMEN";
          setTipo(selectedKey);
        }}
      >
        <SelectItem key="MASA" >Masa</SelectItem>
        <SelectItem key="VOLUMEN">Volumen</SelectItem>
      </Select>
      <Input
        value={equivalenciabase.toString()}
        size="sm"
        label="Equivalencia en gramos (g)"
        type="number"
        onChange={(e) => setEquivalenciabase(Number(e.target.value))}
      />
    </ModalComponent>
  );
};

export default EditarUnidadesMedidaModal;

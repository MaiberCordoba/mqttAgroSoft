import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTipoControl } from "../../hooks/tipoControl/usePatchTipoControl";
import { Input, Textarea } from "@heroui/react";
import { TipoControl } from "../../types";

interface EditarTipoControlModalProps {
  tipoControl: TipoControl;
  onClose: () => void;
}

const EditarTipoControlModal: React.FC<EditarTipoControlModalProps> = ({ tipoControl, onClose }) => {
  const [nombre, setNombre] = useState<string>(tipoControl.nombre);
  const [descripcion, setDescripcion] = useState<string>(tipoControl.descripcion);
  

  const { mutate, isPending } = usePatchTipoControl();

  const handleSubmit = () => {
    mutate(
      {
        id: tipoControl.id,
        data: {
          nombre,
          descripcion,
         
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
      title="Editar Tipo de Control"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input label="Nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <Textarea label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
     
    </ModalComponent>
  );
};

export default EditarTipoControlModal;

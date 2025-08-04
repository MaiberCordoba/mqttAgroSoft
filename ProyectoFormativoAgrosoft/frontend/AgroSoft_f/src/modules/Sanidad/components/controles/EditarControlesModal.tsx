// EditarControlModal.tsx
import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchControles } from "../../hooks/controles/usePatchControles";
import { Controles } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";
import { useGetUsers } from '@/modules/Users/hooks/useGetUsers'; 

interface EditarControlModalProps {
  control: Controles;
  onClose: () => void;
}

const EditarControlModal: React.FC<EditarControlModalProps> = ({ control, onClose }) => {
  //const [fechaControl, setFechaControl] = useState(control.fechaControl);
  const [descripcion, setDescripcion] = useState(control.descripcion);
  const [fk_Afeccion, setFk_Afeccion] = useState<number>(control.fk_Afeccion || 0);
  const [fk_TipoControl, setFk_TipoControl] = useState<number>(control.fk_TipoControl || 0);
  const [fk_Usuario, setFk_Usuario] = useState<number>(control.fk_Usuario || 0);

  const { data: afecciones } = useGetAfeccionesCultivo();
  const { data: tiposControl } = useGetTipoControl();
  const { data: usuarios } = useGetUsers();
  const { mutate, isPending } = usePatchControles();

  const handleSubmit = () => {
    mutate(
      {
        id: control.id,
        data: {  descripcion, fk_Afeccion, fk_TipoControl, fk_Usuario },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Control"
      footerButtons={[{ label: isPending ? "Guardando..." : "Guardar", onClick: handleSubmit }]}
    >{/*
      <Input label="Fecha" type="date" value={fechaControl} onChange={(e) => setFechaControl(e.target.value)} />*/}
      <Textarea label="Descripción"  size="sm"  value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <Select
        label="Afección"
        size="sm"
        selectedKeys={[fk_Afeccion.toString()]}
        onSelectionChange={(keys) => setFk_Afeccion(Number(Array.from(keys)[0]))}
      >
        {(afecciones || []).map((af) => (
          <SelectItem key={af.id.toString()}>{af.plagas?.tipoPlaga?.nombre || "Sin nombre"}</SelectItem>
        ))}
      </Select>

      <Select
        label="Tipo de Control"
        size="sm"
        selectedKeys={[fk_TipoControl.toString()]}
        onSelectionChange={(keys) => setFk_TipoControl(Number(Array.from(keys)[0]))}
      >
        {(tiposControl || []).map((tc) => (
          <SelectItem key={tc.id.toString()}>{tc.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Usuario"
        size="sm"
        selectedKeys={[fk_Usuario.toString()]}
        onSelectionChange={(keys) => setFk_Usuario(Number(Array.from(keys)[0]))}
      >
        {(usuarios || []).map((user) => (
          <SelectItem key={user.id.toString()}>{user.nombre}</SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarControlModal;

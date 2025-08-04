import { useState } from "react";
import { postControles } from "../../hooks/controles/usePostControles";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { Plus } from "lucide-react";
import { CrearTipoControlModal } from "../tipocontrol/CrearTipoControlModal";
import { CrearAfeccionCultivoModal } from "../afeccionescultivo/CrearAfeccionescultivoModal";
import { AfeccionesCultivo, Controles, TipoControl } from "../../types";
import { addToast } from "@heroui/toast"; // ← AÑADIDO

interface CrearControlModalProps {
  onClose: () => void;
  onCreate: (nuevoControl: Controles) => void;
}

export const CrearControlModal = ({ onClose, onCreate }: CrearControlModalProps) => {
  const [descripcion, setDescripcion] = useState("");
  const [fk_Afeccion, setFk_Afeccion] = useState<number | null>(null);
  const [fk_TipoControl, setFk_TipoControl] = useState<number | null>(null);
  const [fk_Usuario, setFk_Usuario] = useState<number | null>(null);

  const { data: afecciones } = useGetAfeccionesCultivo();
  const { data: tiposControl, refetch: refetchTipoControl } = useGetTipoControl();
  const { data: users } = useGetUsers();
  const { mutate, isPending } = postControles();

  const [mostrarModalTiposControl, setMostrarModalTiposControl] = useState(false);
  const [mostrarModalAfeccionCultivo, setMostrarModalAfeccionCultivo] = useState(false);

  const handleSubmit = () => {
    if (!descripcion.trim() || !fk_Afeccion || !fk_TipoControl || !fk_Usuario) {
      addToast({
        title: "error",
        description: "rellene campos obligatorios",
        color: "danger",
      });
      return;
    }

    mutate(
      { id: 0, descripcion, fk_Afeccion, fk_TipoControl, fk_Usuario },
      {
        onSuccess: (data) => {
          onClose();
          onCreate(data);
          setDescripcion("");
          setFk_Afeccion(null);
          setFk_TipoControl(null);
          setFk_Usuario(null);
        },
      }
    );
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Control"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Descripción"
          type="text"
          size="sm"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <div className="mb-4">
          <Select
            label="Usuario Responsable"
            placeholder="Selecciona un usuario"
            size="sm"
            selectedKeys={fk_Usuario ? [fk_Usuario.toString()] : []}
            onSelectionChange={(keys) => setFk_Usuario(Number(Array.from(keys)[0]))}
          >
            {(users || []).map((user) => (
              <SelectItem key={user.id.toString()}>{user.nombre}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Afección"
              placeholder="Selecciona una afección"
              size="sm"
              selectedKeys={fk_Afeccion ? [fk_Afeccion.toString()] : []}
              onSelectionChange={(keys) => setFk_Afeccion(Number(Array.from(keys)[0]))}
            >
              {(afecciones || []).map((af) => (
                <SelectItem key={af.id.toString()}>
                  {af.plagas?.nombre || "Sin nombre"}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setMostrarModalAfeccionCultivo(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Tipo de Control"
              placeholder="Selecciona un tipo"
              size="sm"
              selectedKeys={fk_TipoControl ? [fk_TipoControl.toString()] : []}
              onSelectionChange={(keys) => setFk_TipoControl(Number(Array.from(keys)[0]))}
            >
              {(tiposControl || []).map((tc: TipoControl) => (
                <SelectItem key={tc.id.toString()}>{tc.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setMostrarModalTiposControl(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>
      </ModalComponent>

      {mostrarModalTiposControl && (
        <CrearTipoControlModal
          onClose={() => setMostrarModalTiposControl(false)}
          onCreate={(nuevoTipo) => {
            refetchTipoControl();
            setFk_TipoControl(nuevoTipo.id);
          }}
        />
      )}

      {mostrarModalAfeccionCultivo && (
        <CrearAfeccionCultivoModal
          onClose={() => setMostrarModalAfeccionCultivo(false)}
          onCreate={(nuevaAfeccion: AfeccionesCultivo) => {
            setFk_Afeccion(nuevaAfeccion.id);
          }}
        />
      )}
    </>
  );
};

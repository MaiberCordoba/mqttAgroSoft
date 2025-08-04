import { useState } from "react";
import { usePostActividades } from "../../hooks/actividades/usePostActividades";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";
import { Plus } from "lucide-react";
import { Actividades, TipoActividad } from "../../types";
import { User } from "@/modules/Users/types";
import { CrearTipoActividadModal } from "../tipoActividad/CrearTipoActividadModal";
import { Cultivo, Plantaciones } from "@/modules/Trazabilidad/types";
import { CrearCultivoModal } from "@/modules/Trazabilidad/components/cultivos/CrearCultivosModal";
import { CrearUsersModal } from "@/modules/Users/components/CrearUsersModal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { CrearPlantacionModal } from "@/modules/Trazabilidad/components/plantaciones/CrearPlantacionesModal";

interface CrearActividadesModalProps {
  onClose: () => void;
  onCreate: (nuevaActividad: Actividades) => void;
}

export const CrearActividadesModal = ({
  onClose,
}: CrearActividadesModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [fk_Usuario, setFk_Usuario] = useState<number | null>(null);
  const [fk_TipoActividad, setFk_TipoActividad] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [fk_Plantacion, setFkPlantacion] = useState<number | null>(null);

  //Creacion de modales
  const [tipoActividadModal, setTipoActividadModal] = useState(false);
  const [usuarioModal, setUsuarioModal] = useState(false);
  const [cultivoModal, setCultivoModal] = useState(false);
  const [plantacionModal, setPlantacionModal] = useState(false);

  const {
    data: cultivos,
    isLoading: isLoadingCultivos,
    refetch: refetchCultivo,
  } = useGetCultivos();
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsuario,
  } = useGetUsers();
  const {
    data: tiposActividad,
    isLoading: isLoadingTiposActividad,
    refetch: refetchTipoActividad,
  } = useGetTipoActividad();

  const {
    data: plantacion,
    isLoading: isLoadingPlantacion,
    refetch: refetchPlantacion,
  } = useGetPlantaciones();

  const { mutate, isPending } = usePostActividades();

  const handleSubmit = () => {
    if (!fk_Usuario || !fk_TipoActividad || !titulo || !descripcion || !fecha) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger",
      });
      return;
    }

    if (fk_Cultivo && fk_Plantacion) {
      addToast({
        title: "Error",
        description: "No puede elegir cultivo y plantación al mismo tiempo",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        fk_Cultivo,
        fk_Plantacion,
        fk_Usuario,
        fk_TipoActividad,
        titulo,
        descripcion,
        fecha,
      },

      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFkPlantacion(null);
          setFk_Usuario(null);
          setFk_TipoActividad(null);
          setTitulo("");
          setDescripcion("");
          setFecha("");
        },
      }
    );
  };

  const handleTipoActividadCreada = (nuevoTipoActividad: TipoActividad) => {
    refetchTipoActividad();
    setFk_TipoActividad(nuevoTipoActividad.id);
    setTipoActividadModal(false);
  };

  const handleCultivoCreado = (nuevoCultivo: Cultivo) => {
    refetchCultivo();
    setFk_Cultivo(nuevoCultivo.id);
    setCultivoModal(false);
  };

  const handleUsuarioCreado = (nuevoUsuario: User) => {
    refetchUsuario();
    setFk_Usuario(nuevoUsuario.id);
    setUsuarioModal(false);
  };
  const handlePlantacionCreada = (nuevaPlantacion: Plantaciones) => {
    refetchPlantacion();
    setFkPlantacion(nuevaPlantacion.id);
    setPlantacionModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Actividades"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Titulo"
          type="text"
          size="sm"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <Input
          label="Descripción"
          type="text"
          size="sm"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <Input
          label="Fecha Asignacion"
          type="date"
          size="sm"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        {isLoadingCultivos ? (
          <p>Cargando cultivos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                label="Cultivo"
                placeholder="Selecciona un cultivo"
                selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Cultivo(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(cultivos || []).map((cultivo) => (
                  <SelectItem key={cultivo.id.toString()}>
                    {cultivo.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setCultivoModal(true)}
              color="success"
              title="Crear nuevo cultivo"
              radius="full"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
        {isLoadingPlantacion ? (
          <p>Cargando plantaciones...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                label="Plantacion"
                placeholder="Selecciona una Plantacion"
                selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFkPlantacion(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(plantacion || []).map((p) => (
                  <SelectItem
                    key={p.id.toString()}
                    textValue={`Cultivo:${p.cultivo?.nombre} - Era:${p.eras.tipo}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        Cultivo:{p.cultivo?.nombre}
                      </span>
                      <span className="font-semibold">Era: {p.eras.tipo}</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setPlantacionModal(true)}
              color="success"
              title="Crear nueva plantacion"
              radius="full"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {isLoadingUsers ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                label="Usuario"
                placeholder="Selecciona un Usuario"
                selectedKeys={fk_Usuario ? [fk_Usuario.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Usuario(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(users || []).map((usuario) => (
                  <SelectItem key={usuario.id.toString()}>
                    {usuario.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setUsuarioModal(true)}
              color="success"
              title="Crear Usuario"
              radius="full"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {isLoadingTiposActividad ? (
          <p>Cargando tipos de actividad...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                label="Tipo Actividad"
                placeholder="Seleccione el tipo de actividad"
                selectedKeys={
                  fk_TipoActividad ? [fk_TipoActividad.toString()] : []
                }
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_TipoActividad(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(tiposActividad || []).map((tipoActividad) => (
                  <SelectItem key={tipoActividad.id.toString()}>
                    {tipoActividad.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setTipoActividadModal(true)}
              color="success"
              title="Crear nuevo tipo de actividad"
              radius="full"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
      </ModalComponent>

      {tipoActividadModal && (
        <CrearTipoActividadModal
          onClose={() => setTipoActividadModal(false)}
          onCreate={handleTipoActividadCreada}
        />
      )}
      {cultivoModal && (
        <CrearCultivoModal
          onClose={() => setCultivoModal(false)}
          onCreate={handleCultivoCreado}
        />
      )}
      {usuarioModal && (
        <CrearUsersModal
          onClose={() => setUsuarioModal(false)}
          onCreate={handleUsuarioCreado}
        />
      )}
      {plantacionModal && (
        <CrearPlantacionModal
          onClose={() => setPlantacionModal(false)}
          onCreate={handlePlantacionCreada}
        />
      )}
    </>
  );
};

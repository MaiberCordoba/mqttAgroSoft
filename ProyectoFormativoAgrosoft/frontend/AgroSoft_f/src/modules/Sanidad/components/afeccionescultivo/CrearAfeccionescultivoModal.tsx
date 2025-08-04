import { useState } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { EstadoAfeccion, AfeccionesCultivo } from "../../types";
import { usePostAfeccionCultivo } from "../../hooks/afeccionescultivo/usePostAfeccionescultivo";
import { Plus } from "lucide-react";
import { CrearAfeccionModal } from "../afecciones/CrearAfeccionModal";
import { CrearPlantacionModal } from "@/modules/Trazabilidad/components/plantaciones/CrearPlantacionesModal";
import { addToast } from "@heroui/toast";

interface CrearAfeccionCultivoModalProps {
  onClose: () => void;
}

export const CrearAfeccionCultivoModal = ({ onClose }: CrearAfeccionCultivoModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null);
  const [fk_Plaga, setFk_Plaga] = useState<number | null>(null);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>("");
  const [estado, setEstado] = useState<keyof typeof EstadoAfeccion>("ST");

  const { data: plantacionesData, refetch: refetchPlantaciones } = useGetPlantaciones();
  const { data: tiposPlagaData, refetch: refetchAfecciones } = useGetAfecciones();
  const { mutate, isPending } = usePostAfeccionCultivo();

  const [mostrarModalAfeccion, setMostrarModalAfeccion] = useState(false);
  const [mostrarModalPlantacion, setMostrarModalPlantacion] = useState(false);

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_Plaga || !estado || !fechaEncuentro) {
      addToast({
        title: "error",
        description: "rellene campos obligatorios",
        color: "danger",
      });
      return;
    }

    const data: AfeccionesCultivo = {
      fk_Plantacion,
      fk_Plaga,
      estado,
      fechaEncuentro,
      id: 0,
    };

    mutate(data, {
      onSuccess: () => {
        addToast({
          title: "Afección registrada",
          description: "La afección al cultivo fue registrada exitosamente.",
          color: "success",
        });
        onClose();
        setFk_Plantacion(null);
        setFk_Plaga(null);
        setEstado("ST");
        setFechaEncuentro("");
      },
      onError: () => {
        addToast({
          title: "Error",
          description: "Ocurrió un error al guardar la afección al cultivo.",
          color: "danger",
        });
      },
    });
  };

  const handleNuevaAfeccion = async () => {
    const { data } = await refetchAfecciones();
    if (data && data.length > 0) {
      const nueva = data[data.length - 1];
      setFk_Plaga(nueva.id);
    }
  };

  const handleNuevaPlantacion = async () => {
    const { data } = await refetchPlantaciones();
    if (data && data.length > 0) {
      const nueva = data[data.length - 1];
      setFk_Plantacion(nueva.id);
    }
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Afección Cultivo"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        {/* Selector de Plantación con botón para crear */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Plantación"
              placeholder="Selecciona una plantación"
              size="sm"
              selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
              onSelectionChange={(keys) =>
                setFk_Plantacion(Number(Array.from(keys)[0]))
              }
            >
              {plantacionesData?.map((plantacion) => (
                <SelectItem key={plantacion.id.toString()}>
                  {`${plantacion.cultivo?.nombre || `Plantación #${plantacion.id}`} - Era: ${plantacion.eras?.tipo || 'No asignada'}`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={() => setMostrarModalPlantacion(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nueva plantación"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Selector de Afección con botón para crear */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Afectación"
              placeholder="Selecciona una Afectación"
              size="sm"
              selectedKeys={fk_Plaga ? [fk_Plaga.toString()] : []}
              onSelectionChange={(keys) =>
                setFk_Plaga(Number(Array.from(keys)[0]))
              }
            >
              {tiposPlagaData?.map((tipo) => (
                <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={() => setMostrarModalAfeccion(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nueva afección"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <Select
          label="Estado de la Afección"
          size="sm"
          selectedKeys={[estado]}
          onSelectionChange={(keys) =>
            setEstado(Array.from(keys)[0] as keyof typeof EstadoAfeccion)
          }
        >
          {Object.entries(EstadoAfeccion).map(([key, label]) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Fecha del Encuentro"
          type="date"
          size="sm"
          value={fechaEncuentro}
          onChange={(e) => setFechaEncuentro(e.target.value)}
          required
        />
      </ModalComponent>

      {/* Modal crear nueva afectación */}
      {mostrarModalAfeccion && (
        <CrearAfeccionModal
          onClose={() => setMostrarModalAfeccion(false)}
          onCreate={handleNuevaAfeccion}
        />
      )}

      {/* Modal crear nueva plantación */}
      {mostrarModalPlantacion && (
        <CrearPlantacionModal
          onClose={() => setMostrarModalPlantacion(false)}
          onCreate={handleNuevaPlantacion}
        />
      )}
    </>
  );
};

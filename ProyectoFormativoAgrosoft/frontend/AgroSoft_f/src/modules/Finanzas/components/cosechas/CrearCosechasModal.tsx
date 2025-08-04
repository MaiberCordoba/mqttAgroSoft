import { useState } from "react";
import { usePostCosecha } from "../../hooks/cosechas/usePostCosechas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { Cosechas, UnidadesMedida } from "../../types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { Plantaciones } from "@/modules/Trazabilidad/types";
import { CrearPlantacionModal } from "@/modules/Trazabilidad/components/plantaciones/CrearPlantacionesModal";
import { addToast } from "@heroui/toast";

interface CrearCosechasModalProps {
  onClose: () => void;
  onCreate: (nuevaCosecha: Cosechas) => void;
}

export const CrearCosechasModal = ({ onClose }: CrearCosechasModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<string>("");
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [precioUnidad, setPrecioUnidad] = useState<string>("");
  const [fecha, setFecha] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);
  const [PlantacionModal, setPlantacionModal] = useState(false);

  const {
    data: plantaciones,
    isLoading: isLoadingPlantaciones,
    refetch: refetchPlantaciones,
  } = useGetPlantaciones();
  const {
    data: UnidadMedida,
    isLoading: isLoadingUnidadMedida,
    refetch: refetchUnidadMedida,
  } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostCosecha();

  const handleSubmit = () => {
    if (
      !fk_Plantacion ||
      cantidad === "" ||
      !fk_UnidadMedida ||
      !fecha ||
      precioUnidad === ""
    ) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger",
      });
      return;
    }

    const cantidadNumero = Number(cantidad);
    const precioNumero = Number(precioUnidad);

    if (cantidadNumero < 0) {
      setMensajeError("La cantidad cosechada no puede ser negativa");
      return;
    }

    setMensajeError("");

    mutate(
      {
        fk_Plantacion,
        cantidad: cantidadNumero,
        fk_UnidadMedida,
        fecha,
        precioUnidad: precioNumero,
      },

      {
        onSuccess: () => {
          onClose();
          setFk_Plantacion(null);
          setCantidad("");
          setFk_UnidadMedida(null);
          setFecha("");
          setPrecioUnidad("");
          setMensajeError("");
        },
      }
    );
  };

  const handlePlantacionCreada = (nuevaPlantacion: Plantaciones) => {
    refetchPlantaciones();
    setFk_Plantacion(nuevaPlantacion.id);
    setPlantacionModal(false);
  };

  const handleUnidadMedidaCreada = (nuevaUnidadMedida: UnidadesMedida) => {
    refetchUnidadMedida();
    setFk_UnidadMedida(nuevaUnidadMedida.id);
    setUnidadMedidaModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Cosechas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        {mensajeError && (
          <p className="text-red-500 text-sm mb-2">{mensajeError}</p>
        )}

        <Input
          label="Fecha de Cosecha"
          type="date"
          size="sm"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <Input
          label="Cantidad cosechada"
          type="text"
          size="sm"
          value={cantidad}
          onChange={(e) => {
            const valor = e.target.value;
            if (/^\d*$/.test(valor)) setCantidad(valor);
          }}
          required
        />

        <Input
          label="Precio unidad"
          type="text"
          size="sm"
          value={precioUnidad}
          onChange={(e) => {
            const valor = e.target.value;
            if (/^\d*\.?\d*$/.test(valor)) setPrecioUnidad(valor);
          }}
          required
        />

        {isLoadingPlantaciones ? (
          <p>Cargando plantaciones...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Cultivo"
                size="sm"
                placeholder="Selecciona una plantacion"
                selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Plantacion(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(plantaciones || [])
                .filter((plantacion) => plantacion.cultivo?.activo)
                .map((plantacion) => (
                  <SelectItem key={plantacion.id.toString()}>
                    {plantacion.cultivo?.nombre}
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

        {isLoadingUnidadMedida ? (
          <p>Cargando unidades de medida...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Unidad de medida"
                size="sm"
                placeholder="Selecciona una unidad de medida"
                selectedKeys={
                  fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []
                }
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(UnidadMedida || []).map((unidadesMedida) => (
                  <SelectItem key={unidadesMedida.id.toString()}>
                    {unidadesMedida.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setUnidadMedidaModal(true)}
              color="success"
              title="Crear nueva Unidad de Medida"
              radius="full"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
      </ModalComponent>

      {PlantacionModal && (
        <CrearPlantacionModal
          onClose={() => setPlantacionModal(false)}
          onCreate={handlePlantacionCreada}
        />
      )}

      {unidadMedidaModal && (
        <CrearUnidadesMedidaModal
          onClose={() => setUnidadMedidaModal(false)}
          onCreate={handleUnidadMedidaCreada}
        />
      )}
    </>
  );
};

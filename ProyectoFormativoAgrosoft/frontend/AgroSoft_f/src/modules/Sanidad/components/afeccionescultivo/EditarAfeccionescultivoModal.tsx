import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchAfeccionesCultivo } from "../../hooks/afeccionescultivo/usePatchAfeccionescultivo";
import { AfeccionesCultivo, EstadoAfeccion } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";

interface EditarAfeccionCultivoModalProps {
  afeccionCultivo: AfeccionesCultivo;
  onClose: () => void;
}

const EditarAfeccionCultivoModal: React.FC<EditarAfeccionCultivoModalProps> = ({ afeccionCultivo, onClose }) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(afeccionCultivo.fk_Plantacion ?? null);
  const [fk_Plaga, setFk_Plaga] = useState<number | null>(afeccionCultivo.fk_Plaga ?? null);
  const [estado, setEstado] = useState<keyof typeof EstadoAfeccion>(afeccionCultivo.estado as keyof typeof EstadoAfeccion);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>(afeccionCultivo.fechaEncuentro ?? "");

  const { data: plantaciones, isLoading: isLoadingPlantaciones } = useGetPlantaciones();
  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetAfecciones();
  const { mutate, isPending } = usePatchAfeccionesCultivo();

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_Plaga || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    console.log("Editando afección con datos:", { id: afeccionCultivo.id, fk_Plantacion, fk_Plaga, estado, fechaEncuentro });

    mutate(
      {
        id: afeccionCultivo.id,
        data: {
          fk_Plantacion: Number(fk_Plantacion),
          fk_Plaga: Number(fk_Plaga),
          estado,
          fechaEncuentro,
        },
      },
      {
        onSuccess: () => {
          console.log("Afección editada con éxito");
          onClose();
        },
        onError: (error) => {
          console.error("Error al editar la afección:", error);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Afección Cultivo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Selector de Plantación */}
      {isLoadingPlantaciones ? (
        <p>Cargando plantaciones...</p>
      ) : (
        <Select
          label="Plantación"
          placeholder="Selecciona una plantación"
          size="sm"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
          onSelectionChange={(keys) => setFk_Plantacion(Number(Array.from(keys)[0]))}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem key={plantacion.id.toString()}>
              {plantacion.cultivo?.nombre || `Plantación #${plantacion.id}`}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Plaga */}
      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          size="sm"
          selectedKeys={fk_Plaga ? [fk_Plaga.toString()] : []}
          onSelectionChange={(keys) => setFk_Plaga(Number(Array.from(keys)[0]))}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Estado de Afección */}
      <Select
        label="Estado de la Afección"
        placeholder="Selecciona el estado"
        size="sm"
        selectedKeys={estado ? [estado] : []}
        onSelectionChange={(keys) => setEstado(Array.from(keys)[0] as keyof typeof EstadoAfeccion)}
      >
        {Object.entries(EstadoAfeccion).map(([key, label]) => (
          <SelectItem key={key}>{label}</SelectItem>
        ))}
      </Select>

      {/* Campo de fecha de encuentro */}
      <Input
        label="Fecha del Encuentro"
        type="date"
        size="sm"
        value={fechaEncuentro}
        onChange={(e) => setFechaEncuentro(e.target.value)}
        required
      />
    </ModalComponent>
  );
};

export default EditarAfeccionCultivoModal;
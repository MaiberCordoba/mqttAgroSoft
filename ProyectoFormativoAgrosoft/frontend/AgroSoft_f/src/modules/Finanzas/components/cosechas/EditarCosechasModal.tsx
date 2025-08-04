import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchCosechas } from "../../hooks/cosechas/usePatchCosechas";
import { Cosechas } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";

interface EditarCosechaModalProps {
  cosecha: Cosechas;
  onClose: () => void;
}

const EditarCosechaModal: React.FC<EditarCosechaModalProps> = ({
  cosecha,
  onClose,
}) => {
  // Cambiamos a string para manejar inputs vacíos
  const [cantidad, setCantidad] = useState<string>(
    cosecha.cantidad !== null && cosecha.cantidad !== undefined
      ? cosecha.cantidad.toString()
      : ""
  );
  const [precioUnidad, setPrecioUnidad] = useState<string>(
    cosecha.precioUnidad !== null && cosecha.precioUnidad !== undefined
      ? cosecha.precioUnidad.toString()
      : ""
  );

  const [fecha, setFecha] = useState<string>(cosecha.fecha);
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(
    cosecha.fk_Plantacion ?? null
  );
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(
    cosecha.fk_UnidadMedida ?? null
  );
  const [mensajeError, setMensajeError] = useState("");

  const { data: plantaciones, isLoading: isLoadingPlantaciones } =
    useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadMedida } =
    useGetUnidadesMedida();
  const { mutate, isPending } = usePatchCosechas();

  const handleSubmit = () => {
    if (
      !fk_Plantacion ||
      cantidad === "" ||
      !fk_UnidadMedida ||
      !fecha ||
      precioUnidad === ""
    ) {
      setMensajeError("Por favor, completa todos los campos.");
      return;
    }

    const cantidadNum = Number(cantidad);
    const precioNum = Number(precioUnidad);

    if (cantidadNum < 0) {
      setMensajeError("La cantidad cosechada no puede ser negativa");
      return;
    }

    setMensajeError("");

    mutate(
      {
        id: cosecha.id,
        data: {
          cantidad: cantidadNum,
          fecha,
          fk_Plantacion,
          fk_UnidadMedida,
          precioUnidad: precioNum,
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
      title="Editar Cosecha"
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
        value={fecha}
        size="sm"
        label="Fecha de Cosecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
      />

      <Input
        value={cantidad}
        size="sm"
        label="Cantidad cosechada"
        type="text"
        onChange={(e) => {
          const valor = e.target.value;
          // Solo permitir dígitos
          if (/^\d*$/.test(valor)) setCantidad(valor);
        }}
      />

      <Input
        value={precioUnidad}
        size="sm"
        label="Precio unidad"
        type="text"
        onChange={(e) => {
          const valor = e.target.value;
          // Permitir números con decimales
          if (/^\d*\.?\d*$/.test(valor)) setPrecioUnidad(valor);
        }}
      />

      {isLoadingPlantaciones ? (
        <p>Cargando Plantaciones...</p>
      ) : (
        <Select
          label="Plantaciones"
          size="sm"
          placeholder="Selecciona una plantacion"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Plantacion(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem key={plantacion.id.toString()}>
              {plantacion.cultivo?.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {isLoadingUnidadMedida ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de medida"
          size="sm"
          placeholder="Selecciona una unidad de medida"
          selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(unidadesMedida || []).map((unidadMedida) => (
            <SelectItem key={unidadMedida.id.toString()}>
              {unidadMedida.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarCosechaModal;

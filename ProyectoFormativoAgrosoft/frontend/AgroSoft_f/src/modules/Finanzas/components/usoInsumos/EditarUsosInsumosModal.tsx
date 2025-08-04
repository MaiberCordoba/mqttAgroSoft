import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosInsumos } from "../../hooks/usoInsumos/usePatchUsoInsumos";
import { UsosInsumos } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";

interface EditarUsoInsumoModalProps {
  usoInsumo: UsosInsumos;
  onClose: () => void;
}

const EditarUsoInsumoModal: React.FC<EditarUsoInsumoModalProps> = ({ usoInsumo, onClose }) => {
  const [fk_Insumo, setFk_Insumo] = useState<number>(usoInsumo.fk_Insumo || 0);
  const [fk_Actividad, setFk_Actividad] = useState<number>(usoInsumo.fk_Actividad || 0);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number>(usoInsumo.fk_UnidadMedida || 0);
  const [cantidadProducto, setCantidadProducto] = useState(usoInsumo.cantidadProducto);
  const [fk_Control, setFk_Control] = useState<number>(usoInsumo.fk_Control || 0);
  const [error,setError] = useState("")

  const { data: insumos, isLoading: isLoadingInsumos } = useGetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { data: unidadesMedida, isLoading: isLoadingUnidades } = useGetUnidadesMedida();
  const { data: control, isLoading: isLoadingControl } = useGetControles();

  const { mutate, isPending } = usePatchUsosInsumos();

  const handleSubmit = () => {
    if (fk_Actividad && fk_Control){
      setError("Puede elegir una actividad o un control, no ambos")
      return
    }
    if (cantidadProducto < 0){
      setError("La cantidad no puede ser negativa")
      return
    }
    setError("")
    mutate(
      {
        id: usoInsumo.id,
        data: {
          fk_Insumo: fk_Insumo || null,
          fk_Actividad: fk_Actividad || null,
          fk_Control: fk_Control || null,
          fk_UnidadMedida: fk_UnidadMedida || null,
          cantidadProducto,
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
      title="Editar Uso de Insumo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <Input
        label="Cantidad Usada"
        size="sm"
        value={cantidadProducto.toString()}
        type="number"
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
        required
      />

      {/* Selector de Insumos */}
      {isLoadingInsumos ? (
        <p>Cargando insumos...</p>
      ) : (
        <Select
          label="Insumo"
          placeholder="Selecciona un insumo"
          size="sm"
          selectedKeys={[fk_Insumo.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Insumo(Number(selectedKey));
          }}
        >
          {(insumos || []).map((insumo) => (
            <SelectItem key={insumo.id.toString()}>{insumo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Actividades */}
      {isLoadingActividades ? (
        <p>Cargando actividades...</p>
      ) : (
        <Select
          label="Actividad"
          size="sm"
          placeholder="Selecciona una actividad"
          selectedKeys={[fk_Actividad.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(Number(selectedKey));
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
          ))}
        </Select>
      )}
      {isLoadingControl ? (
        <p>Cargando controles...</p>
      ) : (
        <Select
          label="Control"
          size="sm"
          placeholder="Selecciona un control"
          selectedKeys={[fk_Control.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Control(Number(selectedKey));
          }}
        >
          {(control || []).map((c) => (
            <SelectItem key={c.id.toString()}>{c.descripcion}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Unidad de Medida */}
      {isLoadingUnidades ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de Medida"
          size="sm"
          placeholder="Selecciona una unidad"
          selectedKeys={[fk_UnidadMedida.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_UnidadMedida(Number(selectedKey));
          }}
        >
          {(unidadesMedida || []).map((unidad) => (
            <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarUsoInsumoModal;

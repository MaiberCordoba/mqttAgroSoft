import { useState } from "react";
import { usePostUsoInsumo } from "../../hooks/usoInsumos/usePostUsoInsumos";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";

import { Actividades, Insumos, UnidadesMedida, UsosInsumos } from "../../types";
import { Plus } from "lucide-react";
import { CrearActividadesModal } from "../actividades/CrearActividadModal";
import { CrearInsumosModal } from "../insumos/CrearInsumosModal";
import { Controles } from "@/modules/Sanidad/types";
import { CrearControlModal } from "@/modules/Sanidad/components/controles/CrearControlesModal";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { addToast } from "@heroui/toast";

interface CrearUsoInsumoModalProps {
  onClose: () => void;
  onCreate: (nuevoUsoInsumo: UsosInsumos) => void;
}

export const CrearUsoInsumoModal = ({ onClose }: CrearUsoInsumoModalProps) => {
  const [fk_Insumo, setFk_Insumo] = useState<number | null>(null);
  const [fk_Actividad, setFk_Actividad] = useState<number | null>(null);
  const [fk_Control, setFk_Control] = useState<number | null>(null);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState(0);
  const [error, setError] = useState("")

  const [insumoModal, setInsumoModal] = useState(false);
  const [actividadModal, setActividadModal] = useState(false);
  const [controlModal, setControlModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: insumos, isLoading: isLoadingInsumos, refetch: refetchInsumos } = useGetInsumos();
  const { data: actividades, isLoading: isLoadingActividades, refetch: refetchActividad } = useGetActividades();
  const { data: controles, isLoading: isLoadingControles, refetch: refetchControles } = useGetControles();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadesMedida } = useGetUnidadesMedida();

  const { mutate, isPending } = usePostUsoInsumo();


  const handleSubmit = () => {
    if (
      !fk_Insumo ||
      !fk_UnidadMedida ||
      cantidadProducto === null
    ) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger"
      })
      return;
    }
    const insumoSeleccionado = insumos?.find(c => c.id === fk_Insumo)
    const unidadSeleccionada = unidadesMedida?.find(c => c.id === fk_UnidadMedida)

    const cantidadEnBase = cantidadProducto * unidadSeleccionada?.equivalenciabase

    if (cantidadEnBase > insumoSeleccionado?.cantidadGramos) {
      setError("La cantidad seleccionada " + cantidadEnBase + "(g) Supera la cantidad disponible" + insumoSeleccionado?.cantidadGramos+"(g)")
      return
    }
    if (fk_Actividad && fk_Control) {
      addToast({
        title: "Error",
        description: "Solo puede elegir una actividad o un control,pero no ambos.",
        color: "danger"
      })
      return
    }
    if (!fk_Actividad && !fk_Control) {
      addToast({
        title: "Error",
        description: "Debe elegir almenos una actividad o un control.",
        color: "danger"
      })
      return
    }
    if (cantidadProducto < 0) {
      addToast({
        title: "Valores invalidos",
        description: "Por favor, ingresa valores positivos.",
        color: "danger"
      })
      return
    }




    setError("")
    mutate(
      {
        id: 0,
        fk_Insumo,
        fk_Actividad,
        fk_Control,
        fk_UnidadMedida,
        cantidadProducto,
      },
      {
        onSuccess: () => {
          onClose();
          setFk_Insumo(null);
          setFk_Actividad(null);
          setFk_Control(null);
          setFk_UnidadMedida(null);
          setCantidadProducto(0);
          setError("")
        },
      }
    );
  };

  const handleActividadCreada = (nuevaActividad: Actividades) => {
    refetchActividad();
    setFk_Actividad(nuevaActividad.id);
    setActividadModal(false);
  };

  const handleInsumoCreado = (nuevoInsumo: Insumos) => {
    refetchInsumos();
    setFk_Insumo(nuevoInsumo.id);
    setInsumoModal(false);
  };
  const handleControlCreado = (nuevoControl: Controles) => {
    refetchControles();
    setFk_Control(nuevoControl.id);
    setControlModal(false);
  };
  const handleUnidadMedidaCreada = (nuevaUnidadMedida: UnidadesMedida) => {
    refetchUnidadesMedida();
    setFk_UnidadMedida(nuevaUnidadMedida.id);
    setUnidadMedidaModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registrar Uso de Insumo"
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
          type="number"
          value={cantidadProducto.toString()}
          onChange={(e) => setCantidadProducto(Number(e.target.value))}
          required
        />

        {/* Selector de Insumos */}
        {isLoadingInsumos ? (
          <p>Cargando insumos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Insumo"
                size="sm"
                placeholder="Selecciona un insumo"
                selectedKeys={fk_Insumo ? [fk_Insumo.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Insumo(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(insumos || []).map((insumo) => (
                  <SelectItem key={insumo.id.toString()}>
                    {insumo.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setInsumoModal(true)}
              color="success"
              title="Crear Insumo"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
        {/* Selector de Actividades */}
        {isLoadingActividades ? (
          <p>Cargando actividades...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Actividad"
                size="sm"
                placeholder="Selecciona una actividad"
                selectedKeys={fk_Actividad ? [fk_Actividad.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Actividad(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(actividades || []).map((actividad) => (
                  <SelectItem key={actividad.id.toString()}>
                    {actividad.titulo}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setActividadModal(true)}
              color="success"
              title="Crear actividad"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* Selector de Control */}
        {isLoadingControles ? (
          <p>Cargando Controles...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Control"
                size="sm"
                placeholder="Selecciona un control"
                selectedKeys={fk_Control ? [fk_Control.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Control(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(controles || []).map((control) => (
                  <SelectItem key={control.id.toString()}>
                    {control.descripcion}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setControlModal(true)}
              color="success"
              title="Crear Control"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* Selector de Unidad de Medida */}
        {isLoadingUnidadesMedida ? (
          <p>Cargando Undiades de medida...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Unidad de Medida"
                size="sm"
                placeholder="Selecciona una unidad"
                selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(unidadesMedida || []).map((unidad) => (
                  <SelectItem key={unidad.id.toString()}>
                    {unidad.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setUnidadMedidaModal(true)}
              color="success"
              title="Crear unidad medida"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
      </ModalComponent>

      {actividadModal && (
        <CrearActividadesModal
          onClose={() => setActividadModal(false)}
          onCreate={handleActividadCreada}
        />
      )}
      {insumoModal && (
        <CrearInsumosModal
          onClose={() => setInsumoModal(false)}
          onCreate={handleInsumoCreado}
        />
      )}
      {controlModal && (
        <CrearControlModal
          onClose={() => setControlModal(false)}
          onCreate={handleControlCreado}
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

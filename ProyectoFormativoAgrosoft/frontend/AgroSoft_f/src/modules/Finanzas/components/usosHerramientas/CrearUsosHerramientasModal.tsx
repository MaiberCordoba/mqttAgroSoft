import { useState } from "react";
import { usePostUsoHerramienta } from "../../hooks/usosHerramientas/usePostUsosHerramientas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { Actividades, Herramientas, UsosHerramientas } from "../../types";
import { Plus } from "lucide-react";
import { CrearActividadesModal } from "../actividades/CrearActividadModal";
import { CrearHerramientasModal } from "../herramientas/CrearHerramientasModal";
import { addToast } from "@heroui/toast";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { Controles } from "@/modules/Sanidad/types";
import { CrearControlModal } from "@/modules/Sanidad/components/controles/CrearControlesModal";

interface CrearUsoHerramientaModalProps {
  onClose: () => void;
  onCreate: (nuevoUsoHerramienta : UsosHerramientas) => void
}

export const CrearUsoHerramientaModal = ({ onClose }: CrearUsoHerramientaModalProps) => {
  const [fk_Herramienta, setFk_Herramienta] = useState<number | null>(null);
  const [fk_Actividad, setFk_Actividad] = useState<number | null>(null);
  const [fk_Control, setFk_Control] = useState<number | null>(null);
  const [unidades, setUnidades] = useState(0)
  const [error,setError] = useState("")

  const [herramientaModal, setHerramientaModal] = useState(false)
  const [actividadModal, setActividadModal] = useState(false)
  const [controlModal, setControlModal] = useState(false)

  const { data: herramientas, isLoading: isLoadingHerramientas, refetch : refetchHerramienta } = useGetHerramientas();
  const { data: actividades, isLoading: isLoadingActividades, refetch : refetchActividad } = useGetActividades();
  const { data: controles, isLoading: isLoadingControles, refetch : refetchControl } = useGetControles();
  const { mutate, isPending } = usePostUsoHerramienta();

  const handleSubmit = () => {
    if (!fk_Herramienta || !unidades) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos.",
        color:"danger"
      })
      return;
    }
    if(unidades < 0){
      addToast({
        title:"Valores invalidos",
        description:"Por favor, ingresa valores positivos.",
        color:"danger"
      })
      return
    }
    if(fk_Control && fk_Actividad){
      addToast({
        title:"Error",
        description:"Solo puede relacionar a una actividad o un control, no ambos.",
        color:"danger"
      })
      return
    }
    const herramientaSeleccionada = herramientas?.find(h => h.id === fk_Herramienta);

    if (unidades > herramientaSeleccionada.unidades){
      setError(`Solo hay disponibles ${herramientaSeleccionada?.unidades} unidades de esta herramienta.`)
      return
    }
    setError("")

    mutate(
      { fk_Herramienta, fk_Actividad,fk_Control, unidades },
      {
        onSuccess: () => {
          onClose();
          setFk_Herramienta(null);
          setFk_Actividad(null);
          setFk_Control(null);
          setUnidades(0)
          setError("")
        },
      }
    );
  };
  const handleActividadCreada = (nuevaActividad : Actividades) => {
    refetchActividad()
    setFk_Actividad(nuevaActividad.id)
    setActividadModal(false)
  }
  const handleHerramientaCreada = (nuevaHerramienta : Herramientas) => {
    refetchHerramienta()
    setFk_Herramienta(nuevaHerramienta.id)
    setHerramientaModal(false)
  }
  const handleControlCreado = (nuevoControl : Controles) => {
    refetchControl()
    setFk_Control(nuevoControl.id)
    setControlModal(false)
  }

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registrar Uso de Herramienta"
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
          type="number"
          size="sm"
          value={unidades.toString()}
          onChange={(e) => setUnidades(Number(e.target.value))}
          required
        />
        {/* Selector de Herramientas */}
        {isLoadingHerramientas ? (
          <p>Cargando herramientas...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Herramienta"
                size="sm"
                placeholder="Selecciona una herramienta"
                selectedKeys={fk_Herramienta ? [fk_Herramienta.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Herramienta(selectedKey ? Number(selectedKey) : null);
                }}
                >
                {(herramientas || []).map((herramienta) => (
                  <SelectItem
                    key={herramienta.id.toString()}
                    textValue={`Nombre: ${herramienta.nombre} - Disponible: ${herramienta.unidades}`}
                  >
                    <div>
                      <p className="font-medium">{herramienta.nombre}</p>
                      <p className="text-sm text-gray-500">Disponible: {herramienta.unidades}</p>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={()=>setHerramientaModal(true)}
            color="success"
            title="Crear Herramienta"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
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
            onPress={()=>setActividadModal(true)}
            color="success"
            title="Crear actividad"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
        {isLoadingControles ? (
          <p>Cargando controles...</p>
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
            onPress={()=>setControlModal(true)}
            color="success"
            title="Crear control"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {actividadModal && (
        <CrearActividadesModal
        onClose={()=>setActividadModal(false)}
        onCreate={handleActividadCreada}
        />
      )}
      {herramientaModal && (
        <CrearHerramientasModal
        onClose={()=>setHerramientaModal(false)}
        onCreate={handleHerramientaCreada}
        />
      )}
      {controlModal && (
        <CrearControlModal
        onClose={()=>setControlModal(false)}
        onCreate={handleControlCreado}
        />
      )}
    </>
  );
};

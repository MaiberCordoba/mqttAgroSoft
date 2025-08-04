import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetActividades } from "@/modules/Finanzas/hooks/actividades/useGetActividades";
import { useGetUnidadesTiempo } from "@/modules/Finanzas/hooks/unidadesTiempo/useGetUnidadesTiempo";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { useGetSalarios } from "@/modules/Finanzas/hooks/salarios/useGetSalarios";
import { usePostTiempoActividadControl } from "../../hooks/tiempoActividadControl/usePostTiempoActividadDesecho";
import { Actividades, Salarios, TiempoActividadControl, UnidadesTiempo } from "../../types";
import { Controles } from "@/modules/Sanidad/types";
import { Plus } from "lucide-react";
import { CrearActividadesModal } from "../actividades/CrearActividadModal";
import { CrearControlModal } from "@/modules/Sanidad/components/controles/CrearControlesModal";
import { CrearSalariosModal } from "../salarios/CrearSalariosModal";
import { CrearUnidadesTiempoModal } from "../unidadesTiempo/CrearUnidadesTiempoModal";
import { addToast } from "@heroui/toast";

interface CrearTiempoActividadControlModalProps {
  onClose: () => void;
  onCreate: (nuevoTiempoAC: TiempoActividadControl) => void
}

export const CrearTiempoActividadControlModal = ({ onClose }: CrearTiempoActividadControlModalProps) => {
  const [tiempo, setTiempo] = useState(0);
  const [fk_unidadTiempo, setFk_UnidadTiempo] = useState<number | null>(null);
  const [fk_actividad, setFk_Actividad] = useState<number | null>(null);
  const [fk_control, setFk_Control] = useState<number | null>(null);
  const [fk_salario, setFk_Salario] = useState<number | null>(null);

  const [actividadModal, setActividadModal] = useState(false)
  const [unidadTiempoModal, setUnidadTiempoModal] = useState(false)
  const [controlModal, setControlModal] = useState(false)
  const [salarioModal, setSalarioModal] = useState(false)
  const [error,setError] = useState("")

  const { data: actividades, isLoading: isLoadingActividad, refetch: refetchActividad } = useGetActividades();
  const { data: unidadesTiempo, isLoading: isLoadingUnidadTiempo, refetch: refetchUnidadTiempo } = useGetUnidadesTiempo();
  const { data: controles, isLoading: isLoadingControles, refetch: refetchControl } = useGetControles();
  const { data: salarios, isLoading: isloadingSalarios, refetch: refetchSalario } = useGetSalarios();
  const { mutate, isPending } = usePostTiempoActividadControl();

  const handleSubmit = () => {
    if (
      !tiempo || !fk_unidadTiempo || !fk_salario
    ) {
      addToast({
        title:"Campos requeridos",
        description:"Por favor, completa todos los campos",
        color:"danger"
      })
      return;
    }
    if (fk_control && fk_actividad){
      addToast({
        title:"Error",
        description:"Solo puede elegir una actividad o un contro,no ambas.",
        color:"danger"
      })
      return
    }
    if(tiempo < 0){
      addToast({
        title:"Valores invalidos",
        description:"Por favor, ingresa valores positivos",
        color:"danger"
      })
      return
    }
    setError("")

    mutate(
      {tiempo,fk_unidadTiempo, fk_actividad, fk_control, fk_salario },
      {
        onSuccess: () => {
          onClose();
          setTiempo(0);
          setFk_UnidadTiempo(null);
          setFk_Actividad(null);
          setFk_Control(null);
          setFk_Salario(null);
          setError("")
        },
      }
    );
  };
  const handleActividadCreada = (nuevaActividad : Actividades) =>{
    refetchActividad()
    setFk_Actividad(nuevaActividad.id)
    setActividadModal(false)
  }
  const handleUnidadTiempoCreada = (nuevaUnidadTiempo : UnidadesTiempo) =>{
    refetchUnidadTiempo()
    setFk_UnidadTiempo(nuevaUnidadTiempo.id)
    setUnidadTiempoModal(false)
  }
  const handleControlCreado = (nuevoControl : Controles) =>{
    refetchControl()
    setFk_Control(nuevoControl.id)
    setControlModal(false)
  }
  const handleSalarioCreado = (nuevoSalario : Salarios) =>{
    refetchSalario()
    setFk_Salario(nuevoSalario.id)
    setSalarioModal(false)
  }

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registrar Tiempo Actividad"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        <p className="text-red-500 text-sm mb-2">{error}</p>
        <Input
          label="Tiempo"
          size="sm"
          type="number"
          value={tiempo.toString()}
          onChange={(e) => setTiempo(Number(e.target.value))}
          required
          />
          {isLoadingUnidadTiempo ? (
          <p>Cargando unidades de medida...</p>
          ) : (

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Unidad de Tiempo"
                size="sm"
                placeholder="Selecciona una unidad"
                selectedKeys={fk_unidadTiempo ? [fk_unidadTiempo.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_UnidadTiempo(selectedKey ? Number(selectedKey) : null);
                }}
                >
                {(unidadesTiempo || []).map((unidad) => (
                  <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={()=> setUnidadTiempoModal(true)}
              color="success"
              title="Crear unidad de tiempo"
              size="sm"
              >
                  <Plus className="w-5 h-5 text-white"/>
              </Button>
          </div>
          )}
        {isLoadingActividad ? (
         <p>Cargando actividades ...</p> 
        ) : (

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select
            label="Actividad"
            size="sm"
            placeholder="Selecciona una actividad"
            selectedKeys={fk_actividad ? [fk_actividad.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setFk_Actividad(selectedKey ? Number(selectedKey) : null);
            }}
            >
              {(actividades || [])
              .filter((actividad) => actividad.estado === "AS")
              .map((actividad) => (
              <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={()=> setActividadModal(true)}
            color="success"
            title="Crear nueva actividad"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
        </div>
        )}
        {isLoadingControles ?(
          <p>Cargando Controles...</p>
        ) : (

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select
              label="Control"
              size="sm"
              placeholder="Selecciona un control"
              selectedKeys={fk_control ? [fk_control.toString()] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_Control(selectedKey ? Number(selectedKey) : null);
              }}
              >
              {(controles || []).map((control) => (
                <SelectItem key={control.id.toString()}>{control.descripcion}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={()=> setControlModal(true)}
            color="success"
            title="Crear unidad medida"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
        </div>
        )}
        {isloadingSalarios ?  (
          <p>Cargando salarios...</p>
        ) : (

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select
              label="Salario"
              size="sm"
              placeholder="Selecciona un salario"
              selectedKeys={fk_salario ? [fk_salario.toString()] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_Salario(selectedKey ? Number(selectedKey) : null);
              }}
            >
              {(salarios || []).map((salario) => (
                <SelectItem key={salario.id.toString()}>{salario.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
          onPress={()=> setSalarioModal(true)}
          color="success"
          title="Crear salario"
          size="sm"
          >
              <Plus className="w-5 h-5 text-white"/>
          </Button>
        </div>
        )}
      </ModalComponent>
      {actividadModal &&(
        <CrearActividadesModal
        onClose={()=>setActividadModal(false)}
        onCreate={handleActividadCreada}
        />
      )}
      {unidadTiempoModal &&(
        <CrearUnidadesTiempoModal
        onClose={()=>setUnidadTiempoModal(false)}
        onCreate={handleUnidadTiempoCreada}
        />
      )}
      {controlModal &&(
        <CrearControlModal
        onClose={()=>setControlModal(false)}
        onCreate={handleControlCreado}
        />
      )}
      {salarioModal &&(
        <CrearSalariosModal
        onClose={()=>setSalarioModal(false)}
        onCreate={handleSalarioCreado}
        />
      )}
    </>
  );
};

import { useState } from "react";
import { usePostDesecho } from "../../hooks/desechos/usePostDesechos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";
import { Desechos, TiposDesechos } from "../../types";
import { Plus } from "lucide-react";
import { CrearTiposDesechosModal } from "../tiposDesechos/CrearTiposDesechosModal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { Plantaciones } from "@/modules/Trazabilidad/types";
import { CrearPlantacionModal } from "@/modules/Trazabilidad/components/plantaciones/CrearPlantacionesModal";
import { addToast } from "@heroui/toast";

interface CrearDesechosModalProps {
  onClose: () => void;
  onCreate: (nuevoDesecho: Desechos) => void
}

export const CrearDesechosModal = ({ onClose }: CrearDesechosModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null); // Cambiado a número o null
  const [fk_TipoDesecho, setFk_TipoDesecho] = useState<number | null>(null); 
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [error,setError] = useState("")
  //Creacion modales 
  const [plantacionModal, setPlantacionModal] = useState(false)
  const [tipoDesechosModal, setTiposDesechosModal] = useState(false)

  const { data: tiposDesechos, isLoading: isLoadingTiposDesechos,refetch:refretchTiposDesechos } = useGetTiposDesechos();
  const { data: plantaciones, isLoading: isLoadingPlantaciones,refetch:refretchPlantaciones } = useGetPlantaciones();
  const { mutate, isPending } = usePostDesecho();

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_TipoDesecho || !nombre || !descripcion) {
      addToast({
        title:"Campos requeridos",
        description:"por favor,completa todos los campos.",
        color:"danger"
      })
      return;
    }
    setError("")

    mutate(
      { id:0 ,fk_Plantacion, fk_TipoDesecho, nombre, descripcion },
      {
        onSuccess: () => {
          onClose();
          setFk_Plantacion(null);
          setFk_TipoDesecho(null);
          setNombre("");
          setDescripcion("");
          setError("")
        },
      }
    );
  };
  const handleTipoDesechoCreado = (nuevoTipoDesecho:TiposDesechos)=>{
    refretchTiposDesechos()
    setFk_TipoDesecho(nuevoTipoDesecho.id)
    setTiposDesechosModal(false)
  }
  const handlePlantacionCreada = (nuevaPlantacion:Plantaciones)=>{
    refretchPlantaciones()
    setFk_Plantacion(nuevaPlantacion.id)
    setPlantacionModal(false)
  }
  return (
    <>

      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Desechos"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        {error &&(
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        <Input
          label="Nombre desecho"
          type="text"
          size="sm"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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

        {/* Selector de Cultivos */}
        {isLoadingPlantaciones ? (
          <p>Cargando plantaciones...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
            <Select
            label="Plantacion"
            size="sm"
            placeholder="Selecciona una Plantacion"
            selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []} // HeroUI espera un array de strings
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
              setFk_Plantacion(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
            }}
          >
            {(plantaciones || []).map((plantacion) => (
              <SelectItem key={plantacion.id.toString()}>
                {`Plantación cultivo: ${plantacion.cultivo.nombre}`}
              </SelectItem>
            ))}
          </Select>
            </div>
            <Button
            onPress={()=> setPlantacionModal(true)}
            color="success"
            title="Crear plantacion"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}

        {/* Selector de Tipos de Desechos */}
        {isLoadingTiposDesechos ? (
          <p>Cargando tipos de desechos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Tipo de desecho"
                size="sm"
                placeholder="Selecciona un tipo de desecho"
                selectedKeys={fk_TipoDesecho ? [fk_TipoDesecho.toString()] : []} // HeroUI espera un array de strings
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
                  setFk_TipoDesecho(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
                }}
              >
                {(tiposDesechos || []).map((tipo) => (
                  <SelectItem key={tipo.id.toString()}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={()=> setTiposDesechosModal(true)}
            color="success"
            title="Crear tipo de desecho"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {plantacionModal && (
        <CrearPlantacionModal
        onClose={()=>{setPlantacionModal(false)}}
        onCreate={handlePlantacionCreada}
        />
      )}
      {tipoDesechosModal && (
        <CrearTiposDesechosModal
        onClose={()=>{setTiposDesechosModal(false)}}
        onCreate={handleTipoDesechoCreado}
        />
      )}
    </>
  );
};

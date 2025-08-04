import { useState } from "react";
import { usePostCultivos } from "../../hooks/cultivos/usePostCultivos";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Switch, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearEspecieModal } from "../especies/CrearEspecieModal";
import { Cultivo } from "../../types";
import { addToast } from "@heroui/toast";

interface CrearCultivoModalProps {
  onClose: () => void;
  onCreate: (nuevoCultivo: Cultivo) => void;
}

export const CrearCultivoModal = ({ onClose, onCreate }: CrearCultivoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [activo, setActivo] = useState<boolean>(true);
  const [fk_EspecieId, setFk_EspecieId] = useState<number | null>(null);
  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);

  const { mutate, isPending } = usePostCultivos();
  const {
    data: especies,
    isLoading: isLoadingEspecies,
    refetch: refetchEspecies,
  } = useGetEspecies();

  const handleSubmit = () => {
    if (!nombre || !fk_EspecieId) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor completa todos los campos.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        nombre,
        activo,
        fk_Especie: fk_EspecieId,
      },
      {
        onSuccess: (data) => {
          addToast({
            title: "Creación exitosa",
            description: "Cultivo registrado con éxito",
            color: "success",
          });
          setNombre("");
          setFk_EspecieId(null);
          setActivo(true);
          onCreate(data); // ← Solo notifica desde aquí
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error al crear cultivo",
            description: "No se pudo registrar el cultivo",
            color: "danger",
          });
        },
      }
    );
  };

  const handleEspecieCreada = (nuevaEspecie: { id: number }) => {
    refetchEspecies();
    setFk_EspecieId(nuevaEspecie.id);
    setMostrarModalEspecie(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Cultivo"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "solid",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Nombre del Cultivo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          size="sm"
        />

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1">
            {isLoadingEspecies ? (
              <p>Cargando especies...</p>
            ) : (
              <Select
                label="Especie"
                placeholder="Selecciona una especie"
                size="sm" 
                selectedKeys={fk_EspecieId ? [fk_EspecieId.toString()] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setFk_EspecieId(Number(selected));
                }}
              >
                {(especies || []).map((especie) => (
                  <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
                ))}
              </Select>
            )}
          </div>
          <Button
            onPress={() => setMostrarModalEspecie(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nueva especie"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Switch
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            color="success"
          >
            {activo ? "Activo" : "Inactivo"}
          </Switch>
        </div>
      </ModalComponent>

      {mostrarModalEspecie && (
        <CrearEspecieModal
          onClose={() => setMostrarModalEspecie(false)}
          onCreate={handleEspecieCreada}
        />
      )}
    </>
  );
};

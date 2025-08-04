import { useState } from "react";
import { usePostPlantaciones } from "../../hooks/plantaciones/usePostPlantaciones";
import { useGetEras } from "../../hooks/eras/useGetEras";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import type { Cultivo, Semillero, Eras, Plantaciones } from "../../types";
import { CrearCultivoModal } from "../cultivos/CrearCultivosModal";
import { CrearSemilleroModal } from "../semillero/CrearSemilleroModal";
import { CrearEraModal } from "../eras/CrearEraModal";
import { addToast } from "@heroui/toast";

interface CrearPlantacionModalProps {
  onClose: () => void;
  onCreate: (nuevaPlantacion: Plantaciones) => void;
}

export const CrearPlantacionModal = ({ onClose, onCreate }: CrearPlantacionModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [fk_semillero, setFk_semillero] = useState<number | null>(null);
  const [fk_Era, setFk_Era] = useState<number | null>(null);
  const [unidades, setUnidades] = useState<number>(0);
  const [fechaSiembra, setFechaSiembra] = useState<string>("");

  const [modalCultivoVisible, setModalCultivoVisible] = useState(false);
  const [modalSemilleroVisible, setModalSemilleroVisible] = useState(false);
  const [modalEraVisible, setModalEraVisible] = useState(false);

  const { mutate, isPending } = usePostPlantaciones();
  const { data: cultivos = [], refetch: refetchCultivos } = useGetCultivos();
  const { data: semilleros = [], refetch: refetchSemilleros } = useGetSemilleros();
  const { data: eras = [], refetch: refetchEras } = useGetEras();

  const handleSubmit = () => {
    const seleccionInvalida =
      (!fk_Cultivo && !fk_semillero) || (fk_Cultivo && fk_semillero);

    if (seleccionInvalida || !fk_Era || !unidades || !fechaSiembra) {
      addToast({
        title: "Campos obligatorios",
        description:
          "Selecciona solo un Cultivo o un Semillero y completa era, fecha y unidades.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        fk_Cultivo,
        fk_Era,
        fk_semillero,
        unidades,
        fechaSiembra,
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          setFk_Cultivo(null);
          setFk_semillero(null);
          setFk_Era(null);
          setUnidades(0);
          setFechaSiembra("");
        },
      }
    );
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Plantación"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "solid",
            onClick: handleSubmit,
          },
        ]}
      >
        {/* Cultivo */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Cultivo"
              placeholder="Selecciona un cultivo"
              size="sm"
              selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  setFk_Cultivo(Number(selected));
                  setFk_semillero(null);
                } else {
                  setFk_Cultivo(null);
                }
              }}
              isDisabled={false}
            >
              <SelectItem key="">Ninguno</SelectItem>
              {cultivos.map((cultivo: Cultivo) => (
                <SelectItem key={cultivo.id.toString()}>
                  {cultivo.nombre}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={() => setModalCultivoVisible(true)}
            color="success"
            radius="full"
            size="sm"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Semillero */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Semillero"
              placeholder="Selecciona un semillero"
              size="sm"
              selectedKeys={fk_semillero ? [fk_semillero.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  setFk_semillero(Number(selected));
                  setFk_Cultivo(null);
                } else {
                  setFk_semillero(null);
                }
              }}
              isDisabled={false}
            >
              <SelectItem key="">Ninguno</SelectItem>
              {semilleros.map((semillero: Semillero) => (
                <SelectItem key={semillero.id.toString()}>
                  {`Semillero #${semillero.id} - ${semillero.unidades} unidades`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={() => setModalSemilleroVisible(true)}
            color="success"
            radius="full"
            size="sm"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Unidades y Fecha Siembra */}
        <Input
          className="mt-4"
          label="Unidades"
          type="number"
          size="sm"
          value={unidades.toString()}
          onChange={(e) => setUnidades(Number(e.target.value))}
        />
        <Input
          className="mt-2"
          label="Fecha Siembra"
          type="date"
          size="sm"
          value={fechaSiembra}
          onChange={(e) => setFechaSiembra(e.target.value)}
        />

        {/* Era */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Era"
              placeholder="Selecciona una era"
              size="sm"
              selectedKeys={fk_Era ? [fk_Era.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Era(Number(selected));
              }}
            >
              {eras.map((era: Eras) => (
                <SelectItem key={era.id.toString()}>
                  {`Era ${era.tipo} en ${era.Lote?.nombre || "sin lote"}`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            onPress={() => setModalEraVisible(true)}
            color="success"
            radius="full"
            size="sm"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>
      </ModalComponent>

      {/* Modales secundarios */}
      {modalCultivoVisible && (
        <CrearCultivoModal
          onClose={() => setModalCultivoVisible(false)}
          onCreate={(nuevoCultivo) => {
            refetchCultivos();
            setFk_Cultivo(nuevoCultivo.id);
            setModalCultivoVisible(false);
            setFk_semillero(null);
          }}
        />
      )}

      {modalSemilleroVisible && (
        <CrearSemilleroModal
          onClose={() => setModalSemilleroVisible(false)}
          onCreate={(nuevoSemillero) => {
            refetchSemilleros();
            setFk_semillero(nuevoSemillero.id);
            setModalSemilleroVisible(false);
            setFk_Cultivo(null);
          }}
        />
      )}

      {modalEraVisible && (
        <CrearEraModal
          onClose={() => setModalEraVisible(false)}
          onCreate={(nuevaEra) => {
            refetchEras();
            setFk_Era(nuevaEra.id);
            setModalEraVisible(false);
          }}
        />
      )}
    </>
  );
};

import { useState } from "react";
import { usePostSemilleros } from "../../hooks/semilleros/usePostSemilleros";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearCultivoModal } from "../cultivos/CrearCultivosModal";
import { addToast } from "@heroui/toast";

interface CrearSemilleroModalProps {
  onClose: () => void;
  onCreate: (nuevoSemillero: { id: number }) => void;
}

export const CrearSemilleroModal = ({ onClose, onCreate }: CrearSemilleroModalProps) => {
  const [unidades, setUnidades] = useState<number | "">("");
  const [fechasiembra, setFechaSiembra] = useState<string>("");
  const [fechaestimada, setFechaEstimada] = useState<string>("");
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);

  const [modalCultivoVisible, setModalCultivoVisible] = useState(false);

  const { mutate, isPending } = usePostSemilleros();
  const { data: cultivos, isLoading: isLoadingCultivos, refetch } = useGetCultivos();

  const handleSubmit = () => {
    if (!unidades || !fechasiembra || !fechaestimada || !fk_Cultivo) {
      addToast({
        title: "Campos obligatorios",
        description: "Por favor, completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    mutate(
      { unidades: Number(unidades), fechasiembra, fechaestimada, fk_Cultivo },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          setUnidades("");
          setFechaSiembra("");
          setFechaEstimada("");
          setFk_Cultivo(null);
        },
      }
    );
  };

  const handleCultivoCreado = (nuevoCultivo: { id: number }) => {
    refetch(); // actualiza la lista de cultivos
    setFk_Cultivo(nuevoCultivo.id); // selecciona automáticamente el nuevo cultivo
    setModalCultivoVisible(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Semillero"
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
          label="Unidades"
          type="number"
          value={unidades.toString()}
          onChange={(e) => setUnidades(Number(e.target.value))}
          required
        />

        <Input
          label="Fecha de Siembra"
          type="date"
          value={fechasiembra}
          onChange={(e) => setFechaSiembra(e.target.value)}
          required
        />

        <Input
          label="Fecha Estimada"
          type="date"
          value={fechaestimada}
          onChange={(e) => setFechaEstimada(e.target.value)}
          required
        />

        {isLoadingCultivos ? (
          <p>Cargando cultivos...</p>
        ) : (
          <div className="flex items-end gap-2 mt-4">
            <div className="flex-1">
              <Select
                label="Cultivo"
                placeholder="Selecciona un cultivo"
                selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Cultivo(Number(selectedKey));
                }}
              >
                {(cultivos || []).map((cultivo) => (
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
              title="Agregar nuevo cultivo"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
      </ModalComponent>

      {modalCultivoVisible && (
        <CrearCultivoModal
          onClose={() => setModalCultivoVisible(false)}
          onCreate={handleCultivoCreado}
        />
      )}
    </>
  );
};

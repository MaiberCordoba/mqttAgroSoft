import { useState } from "react";
import { usePostEras } from "../../hooks/eras/usePostEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearLoteModal } from "../lotes/CrearLotesModal";
import { addToast } from "@heroui/toast";

interface CrearEraModalProps {
  onClose: () => void;
}

export const CrearEraModal = ({ onClose }: CrearEraModalProps) => {
  const [fk_lote, setFkLoteId] = useState<number | null>(null);
  const [tipo, setTipo] = useState("");

  const [latI1, setLatI1] = useState<string>("");
  const [longI1, setLongI1] = useState<string>("");
  const [latS1, setLatS1] = useState<string>("");
  const [longS1, setLongS1] = useState<string>("");
  const [latI2, setLatI2] = useState<string>("");
  const [longI2, setLongI2] = useState<string>("");
  const [latS2, setLatS2] = useState<string>("");
  const [longS2, setLongS2] = useState<string>("");

  const [modalLoteVisible, setModalLoteVisible] = useState(false);

  const { mutate, isPending } = usePostEras();
  const { data: lotes, isLoading: isLoadingLotes, refetch } = useGetLotes();

  const handleSubmit = () => {
    const numericLatI1 = Number(latI1);
    const numericLongI1 = Number(longI1);
    const numericLatS1 = Number(latS1);
    const numericLongS1 = Number(longS1);
    const numericLatI2 = Number(latI2);
    const numericLongI2 = Number(longI2);
    const numericLatS2 = Number(latS2);
    const numericLongS2 = Number(longS2);

    if (
      fk_lote === null ||
      tipo.trim() === "" ||
      isNaN(numericLatI1) ||
      isNaN(numericLongI1) ||
      isNaN(numericLatS1) ||
      isNaN(numericLongS1) ||
      isNaN(numericLatI2) ||
      isNaN(numericLongI2) ||
      isNaN(numericLatS2) ||
      isNaN(numericLongS2)
    ) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "danger",
      });
      return;
    }

    const payload = {
      fk_lote,
      tipo,
      latI1: numericLatI1,
      longI1: numericLongI1,
      latS1: numericLatS1,
      longS1: numericLongS1,
      latI2: numericLatI2,
      longI2: numericLongI2,
      latS2: numericLatS2,
      longS2: numericLongS2,
    };

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setFkLoteId(null);
        setTipo("");
        setLatI1("");
        setLongI1("");
        setLatS1("");
        setLongS1("");
        setLatI2("");
        setLongI2("");
        setLatS2("");
        setLongS2("");

        // Opcional: mostrar toast de éxito
        /*
        addToast({
          title: "Éxito",
          description: "La era fue registrada correctamente.",
          color: "success",
        });
        */
      },
      onError: () => {
        addToast({
          title: "Error",
          description: "No fue posible registrar la nueva era.",
          color: "danger",
        });
      },
    });
  };

  const handleLoteCreado = (nuevoLote: { id: number }) => {
    refetch();
    setFkLoteId(nuevoLote.id);
    setModalLoteVisible(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Era"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "solid",
            onClick: handleSubmit,
          },
        ]}
      >
        {isLoadingLotes ? (
          <p>Cargando lotes...</p>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                label="Lote"
                placeholder="Selecciona un lote"
                size="sm"
                selectedKeys={fk_lote !== null ? [fk_lote.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFkLoteId(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(lotes ?? []).map((lote) =>
                  lote?.id !== undefined ? (
                    <SelectItem key={lote.id.toString()}>
                      {lote.nombre}
                    </SelectItem>
                  ) : null
                )}
              </Select>
            </div>
            <Button
              onPress={() => setModalLoteVisible(true)}
              color="success"
              radius="full"
              size="sm"
              title="Agregar nuevo lote"
              className="self-center mt-5"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        <Input
          label="Número de Era #"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          size="sm"
        />

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            label="Lat. Inf. Izquierda"
            type="text"
            inputMode="decimal"
            value={latI1}
            onChange={(e) => setLatI1(e.target.value)}
            size="sm"
          />
          <Input
            label="Lon. Inf. Izquierda"
            type="text"
            inputMode="decimal"
            value={longI1}
            onChange={(e) => setLongI1(e.target.value)}
            size="sm"
          />

          <Input
            label="Lat. Sup. Izquierda"
            type="text"
            inputMode="decimal"
            value={latS1}
            onChange={(e) => setLatS1(e.target.value)}
            size="sm"
          />
          <Input
            label="Lon. Sup. Izquierda"
            type="text"
            inputMode="decimal"
            value={longS1}
            onChange={(e) => setLongS1(e.target.value)}
            size="sm"
          />
          <Input
            label="Lat. Inf. Derecha"
            type="text"
            inputMode="decimal"
            value={latI2}
            onChange={(e) => setLatI2(e.target.value)}
            size="sm"
          />
          <Input
            label="Lon. Inf. Derecha"
            type="text"
            inputMode="decimal"
            value={longI2}
            onChange={(e) => setLongI2(e.target.value)}
            size="sm"
          />

          <Input
            label="Lat. Sup. Derecha"
            type="text"
            inputMode="decimal"
            value={latS2}
            onChange={(e) => setLatS2(e.target.value)}
            size="sm"
          />
          <Input
            label="Lon. Sup. Derecha"
            type="text"
            inputMode="decimal"
            value={longS2}
            onChange={(e) => setLongS2(e.target.value)}
            size="sm"
          />
        </div>
      </ModalComponent>

      {modalLoteVisible && (
        <CrearLoteModal
          onClose={() => setModalLoteVisible(false)}
          onCreate={handleLoteCreado}
        />
      )}
    </>
  );
};

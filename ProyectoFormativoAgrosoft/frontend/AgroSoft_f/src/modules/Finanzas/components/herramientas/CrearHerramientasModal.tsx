import { useState } from "react";
import { usePostHerramienta } from "../../hooks/herramientas/usePostHerramientas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "@/modules/Trazabilidad/hooks/lotes/useGetLotes";
import { Herramientas } from "../../types";
import { Lotes } from "@/modules/Trazabilidad/types";
import { Plus } from "lucide-react";
import { CrearLoteModal } from "@/modules/Trazabilidad/components/lotes/CrearLotesModal";
import { addToast } from "@heroui/toast";

interface CrearHerramientasModalProps {
  onClose: () => void;
  onCreate: (nuevaHerramienta: Herramientas) => void;
}

export const CrearHerramientasModal = ({ onClose }: CrearHerramientasModalProps) => {
  const [fk_Lote, setFk_Lote] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidades, setUnidades] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [error, setError] = useState("");
  const [lotesModal, setLotesModal] = useState(false);

  const { data: lotes, isLoading: isLoadingLotes, refetch: refetchLotes } = useGetLotes();
  const { mutate, isPending } = usePostHerramienta();

  const handleUnidadesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setUnidades(value);
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setPrecio(value);
  };

  const handleSubmit = () => {
    if (!fk_Lote || !nombre.trim() || !descripcion.trim() || unidades.trim() === "" || precio.trim() === "") {
      addToast({
        title:"Campos requeridos",
        description:"por favor,completa todos los campos.",
        color:"danger"
      })
      return;
    }

    const unidadesNum = Number(unidades);
    const precioNum = Number(precio);

    if (isNaN(unidadesNum) || unidadesNum < 0) {
      setError("La cantidad no puede ser negativa.");
      return;
    }

    if (isNaN(precioNum) || precioNum < 0) {
      setError("El precio no puede ser negativo.");
      return;
    }

    setError("");

    mutate(
      { id: 0, fk_Lote, unidades: unidadesNum, nombre, descripcion, precio: precioNum },
      {
        onSuccess: () => {
          onClose();
          setFk_Lote(null);
          setUnidades("");
          setNombre("");
          setDescripcion("");
          setPrecio("");
          setError("");
        },
      }
    );
  };

  const handleLoteCreado = (nuevoLote: Lotes) => {
    refetchLotes();
    setFk_Lote(nuevoLote.id);
    setLotesModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Herramientas"
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
          label="Nombre"
          size="sm"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <Input
          label="Descripción"
          size="sm"
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <Input
          label="Cantidad"
          type="text"
          size="sm"
          value={unidades}
          onChange={handleUnidadesChange}
          required
        />

        <Input
          label="Precio unidad"
          size="sm"
          type="text"
          value={precio}
          onChange={handlePrecioChange}
          required
        />

        {isLoadingLotes ? (
          <p>Cargando Lotes...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Lote"
                size="sm"
                placeholder="Selecciona un Lote"
                selectedKeys={fk_Lote?.toString() ? [fk_Lote.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Lote(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(lotes || []).map((lote) => (
                  <SelectItem key={lote.id.toString()}>{lote.nombre}</SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setLotesModal(true)}
              color="success"
              title="Crear Lote"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
      </ModalComponent>
      {lotesModal && <CrearLoteModal onClose={() => setLotesModal(false)} onCreate={handleLoteCreado} />}
    </>
  );
};

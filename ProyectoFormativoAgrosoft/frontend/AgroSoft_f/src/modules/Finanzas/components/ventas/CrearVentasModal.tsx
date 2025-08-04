import { useState, useEffect } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { Cosechas, UnidadesMedida, Ventas } from "../../types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { Plus } from "lucide-react";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { addToast } from "@heroui/toast";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: (nuevaVenta: Ventas) => void;
}

export const CrearVentasModal = ({ onClose }: CrearVentasModalProps) => {
  const [fk_Cosecha, setFk_Cosecha] = useState<number | null>(null);
  const [valorTotal, setValorTotal] = useState<number | null>(null);
  const [descuento, setDescuento] = useState(0);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState("");

  const [CosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones()
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostVentas();

  useEffect(() => {
    if (!cantidad || !fk_Cosecha || !cosechas || !fk_UnidadMedida || !unidadesMedida) return;

    const cosecha = cosechas.find(c => c.id === fk_Cosecha);
    const unidad = unidadesMedida.find(u => u.id === fk_UnidadMedida);

    if (!cosecha || !unidad) return;

    const cantidadEnBase = cantidad * unidad.equivalenciabase;
    const precioUnitario = cosecha.valorGramo || 0;
    const porcentajeDescuento = descuento ? descuento / 100 : 0;
    const total = cantidadEnBase * precioUnitario * (1 - porcentajeDescuento);

    setValorTotal(Number(total.toFixed(2)));
  }, [cantidad, descuento, fk_Cosecha, cosechas, fk_UnidadMedida, unidadesMedida])

  const handleSubmit = () => {
    if (!fk_Cosecha || !valorTotal || !fk_UnidadMedida || !cantidad) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger"
      })
      return;
    }

    const cosechaSeleccionada = cosechas?.find(c => c.id === fk_Cosecha);
    const unidadSeleccionada = unidadesMedida?.find(u => u.id === fk_UnidadMedida);

    if (!cosechaSeleccionada || !unidadSeleccionada) {
      addToast({
        title: "Error",
        description: "Cosecha o unidad de medida no válidas.",
        color: "danger"
      })
      return;
    }

    const cantidadEnBase = cantidad * unidadSeleccionada.equivalenciabase;

    if (cantidadEnBase > cosechaSeleccionada.cantidadTotal) {
      setError(`La cantidad ingresada ${cantidadEnBase} (g), excede la cantidad disponible ${cosechaSeleccionada.cantidadTotal} (g).`);
      return;
    }
    if (cantidad < 0 || descuento < 0) {
      addToast({
        title: "Valores invalidos",
        description: "Por favor, ingresa valores positivos.",
        color: "danger"
      })
      return
    }

    setError("");

    mutate(
      { fk_Cosecha, valorTotal, fk_UnidadMedida, cantidad, descuento },
      {
        onSuccess: () => {
          onClose();
          setFk_Cosecha(null);
          setDescuento(0);
          setValorTotal(0);
          setFk_UnidadMedida(null);
          setCantidad(0);
          setError("");
        },
      }
    );
  };

  const handleCosechaCreada = (nuevaCosecha: Cosechas) => {
    refetchCosecha();
    setFk_Cosecha(nuevaCosecha.id);
    setCosechaModal(false);
  };

  const handleUnidadMedidaCreada = (nuevaUnidadMedida: UnidadesMedida) => {
    refetchUnidadMedida();
    setFk_Cosecha(nuevaUnidadMedida.id);
    setUnidadMedidaModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Ventas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        <p className="text-red-500 text-sm mb-2">{error}</p>
        {isLoadingCosechas ? (
          <p>Cargando cosechas...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Cosecha"
                size="sm"
                placeholder="Selecciona el producto y cantidad"
                selectedKeys={fk_Cosecha ? [fk_Cosecha.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Cosecha(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(cosechas || [])
                .filter((cosecha)=> cosecha.cantidadTotal > 0)
                .map((cosecha) => {
                  const plantacion = plantaciones?.find(p => p.id === cosecha.fk_Plantacion);
                  const producto = plantacion?.cultivo?.nombre || "Sin producto";
                  return (
                    <SelectItem
                      key={cosecha.id.toString()}
                      textValue={`Producto: ${producto} - Cantidad: ${cosecha.cantidad}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">Producto: {producto}</span>
                        <span>Cantidad: {cosecha.cantidadTotal} (g)</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
            <Button
              onPress={() => setCosechaModal(true)}
              title="Crear cosecha"
              color="success"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
        <Input
          label="Cantidad de producto"
          type="number"
          size="sm"
          value={cantidad.toString()}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />
        {isLoadingUnidadesMedida ? (
          <p>Cargando unidades de medida...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Unidades de medida"
                size="sm"
                placeholder="Selecciona la unidad de medida"
                selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(unidadesMedida || []).map((unidadMedida) => (
                  <SelectItem key={unidadMedida.id.toString()} textValue={unidadMedida.nombre}>
                    {unidadMedida.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setUnidadMedidaModal(true)}
              title="Crear unidad de medida"
              color="success"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}
        <Input
          label="Descuento (opcional)"
          type="number"
          size="sm"
          value={descuento.toString()}
          onChange={(e) => setDescuento(Number(e.target.value))}
        />
        <Input
          label="Valor Total"
          size="sm"
          type="number"
          value={valorTotal?.toString()}
          onChange={(e) => setValorTotal(Number(e.target.value))}
          required
          readOnly
        />


      </ModalComponent>

      {CosechaModal && (
        <CrearCosechasModal onClose={() => setCosechaModal(false)} onCreate={handleCosechaCreada} />
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

import React, { useEffect, useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchVentas } from "../../hooks/ventas/usePatchVentas";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { Input, Select, SelectItem } from "@heroui/react";
import { Ventas } from "../../types";
import { addToast } from "@heroui/toast";

interface EditarVentaModalProps {
  venta: Ventas;
  onClose: () => void;
}

const EditarVentaModal: React.FC<EditarVentaModalProps> = ({ venta, onClose }) => {
  const [fk_Cosecha] = useState<number | null>(venta.fk_Cosecha || null); // solo lectura
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(venta.fk_UnidadMedida || null);
  const [cantidad, setCantidad] = useState<number>(venta.cantidad || 0);
  const [valorTotal, setValorTotal] = useState<number>(venta.valorTotal || 0);
  const [descuento, setDescuento] = useState<number>(venta.descuento || 0);
  const [error, setError] = useState("");

  const { data: cosechas} = useGetCosechas();
  const { data: unidadesMedida } = useGetUnidadesMedida();
  const { data: plantaciones } = useGetPlantaciones();
  const { mutate, isPending } = usePatchVentas();

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
  }, [cantidad, descuento, fk_Cosecha, cosechas, fk_UnidadMedida, unidadesMedida]);

  const handleSubmit = () => {
    if (!fk_Cosecha || !valorTotal || !fk_UnidadMedida || !cantidad) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        color: "danger",
      });
      return;
    }

    const cosechaSeleccionada = cosechas?.find(c => c.id === fk_Cosecha);
    const unidadSeleccionada = unidadesMedida?.find(u => u.id === fk_UnidadMedida);
    const unidadAnterior = unidadesMedida?.find(u => u.id === venta.fk_UnidadMedida);

    if (!cosechaSeleccionada || !unidadSeleccionada || !unidadAnterior) {
      addToast({
        title: "Error",
        description: "Datos inválidos. Verifica la unidad o cosecha.",
        color: "danger",
      });
      return;
    }

    const cantidadAnteriorBase = venta.cantidad * unidadAnterior.equivalenciabase;
    const cantidadEnBase = cantidad * unidadSeleccionada.equivalenciabase;
    const cantidadDisponibleTotal = cosechaSeleccionada.cantidadTotal + cantidadAnteriorBase;

    if (cantidadEnBase > cantidadDisponibleTotal) {
      setError(
        `La cantidad ingresada (${cantidadEnBase} g) excede la disponible (${cantidadDisponibleTotal} g, incluyendo la cantidad previa).`
      );
      return;
    }

    if (cantidad < 0 || descuento < 0) {
      addToast({
        title: "Valores inválidos",
        description: "Por favor, ingresa valores positivos.",
        color: "danger",
      });
      return;
    }

    setError("");

    mutate(
      {
        id: venta.id,
        data:{

          fk_Cosecha,
          fk_UnidadMedida,
          cantidad,
          valorTotal,
          descuento,
        }
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const cosechaActual = cosechas?.find(c => c.id === fk_Cosecha);
  const plantacion = plantaciones?.find(p => p.id === cosechaActual?.fk_Plantacion);
  const producto = plantacion?.cultivo?.nombre || "Sin producto";

  const unidadAnterior = unidadesMedida?.find(u => u.id === venta.fk_UnidadMedida);
  const cantidadAnteriorBase = venta.cantidad * (unidadAnterior?.equivalenciabase || 1);
  const cantidadMaximaAjustada = (cosechaActual?.cantidadTotal || 0) + cantidadAnteriorBase;

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Venta"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      
      <Select
        label="Cosecha"
        size="sm"
        isDisabled
        selectedKeys={fk_Cosecha ? [fk_Cosecha.toString()] : []}
      >
        {cosechaActual && (
          <SelectItem
            key={cosechaActual.id.toString()}
            textValue={`Producto: ${producto} - Cantidad: ${cosechaActual.cantidadTotal}`}
          >
            <div className="flex flex-col">
              <span className="font-semibold">Producto: {producto}</span>
              <span>Cantidad disponible: {cantidadMaximaAjustada} (g)</span>
            </div>
          </SelectItem>
        )}
      </Select>

      <Input
        label={`Cantidad de producto (máx: ${cantidadMaximaAjustada} g)`}
        type="number"
        size="sm"
        value={cantidad.toString()}
        onChange={(e) => setCantidad(Number(e.target.value))}
        required
      />

      <Input
        label="Valor Total"
        type="number"
        size="sm"
        value={valorTotal.toString()}
        onChange={(e) => setValorTotal(Number(e.target.value))}
        readOnly
      />

      <Input
        label="Descuento (%)"
        type="number"
        size="sm"
        value={descuento.toString()}
        onChange={(e) => setDescuento(Number(e.target.value))}
      />

      <Select
        label="Unidad de medida"
        size="sm"
        placeholder="Selecciona la unidad"
        selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
        }}
      >
        {(unidadesMedida || []).map((unidad) => (
          <SelectItem key={unidad.id.toString()} textValue={unidad.nombre}>
            {unidad.nombre}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarVentaModal;

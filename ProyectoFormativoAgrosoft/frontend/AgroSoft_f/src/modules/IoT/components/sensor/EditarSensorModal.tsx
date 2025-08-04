import React, { useState } from "react";
import { usePatchSensor } from "../../hooks/sensor/usePachtSensor";
import { SensorData } from "../../types/sensorTypes";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";
import { addToast } from "@heroui/toast";


interface EditarSensorModalProps {
  sensor: SensorData;
  onClose: () => void;
}

const EditarSensorModal: React.FC<EditarSensorModalProps> = ({ sensor, onClose }) => {
  const [umbral_minimo, setUmbralMinimo] = useState<number | null>(sensor.umbral_minimo ?? null);
  const [umbral_maximo, setUmbralMaximo] = useState<number | null>(sensor.umbral_maximo ?? null);
  const [error] = useState<string>("");

  const { mutate, isPending } = usePatchSensor();

  const handleSubmit = () => {
  if (
    umbral_minimo === 0 || umbral_maximo === 0
  ) {

    addToast({
      title: "Error al actualizar umbral",
      description: "Debe ingresar valores válidos distintos de cero.",
      color: "danger",
    });

    return;
  }
  if(
    umbral_minimo === null || umbral_maximo === null 
  ){
    addToast({
      title: "Error al actualizar umbral",
      description: "El campo no puede quedar vacio",
      color: "danger",
    });

    return;
  }
  if(
    umbral_minimo == umbral_maximo
  ){
    addToast({
      title: "Error al actualizar umbral",
      description: "El valor maximo y minimo no deben ser iguales",
      color: "danger",
    });

    return;
  }
  if(
    umbral_minimo > umbral_maximo
  ){
    addToast({
      title: "Error al actualizar umbral",
      description: "El umbral minimo no debe ser superior al umbral maximo",
      color: "danger",
    });

    return;
  }


  if (typeof sensor.id !== "number") {
    addToast({
      title: "Error al actualizar",
      description: "El identificador del sensor no es válido.",
      color: "danger",
    });
    return;
  }

  mutate(
    {
      id: sensor.id as number,
      data: {
        umbral_minimo,
        umbral_maximo,
      },
    },
    {
      onSuccess: () => {
        addToast({
          title: "Sensor actualizado",
          description: "Los umbrales se actualizaron correctamente.",
          color: "success",
        });
        onClose();
      },
      onError: () => {
        addToast({
          title: "Error al actualizar",
          description: "Hubo un problema al guardar los datos.",
          color: "danger",
        });
      }
    }
  );
};


  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Sensor"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="space-y-4 p-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Umbral Mínimo</label>
          <Input
            type="number"
            value={umbral_minimo !== null ? String(umbral_minimo) : ""}
            onChange={(e) =>
              setUmbralMinimo(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="Ingrese el umbral mínimo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Umbral Máximo</label>
          <Input
            type="number"
            value={umbral_maximo !== null ? String(umbral_maximo) : ""}
            onChange={(e) =>
              setUmbralMaximo(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="Ingrese el umbral máximo"
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditarSensorModal;

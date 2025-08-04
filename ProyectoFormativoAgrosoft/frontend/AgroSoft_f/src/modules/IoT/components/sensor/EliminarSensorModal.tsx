import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteSensor } from "../../hooks/sensor/useDeleteSensor";
import { SensorData } from "../../types/sensorTypes";
import { AlertCircle } from "lucide-react";

interface EliminarSensorModalProps {
  sensor: SensorData;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarSensorModal: React.FC<EliminarSensorModalProps> = ({ 
  sensor, 
  isOpen, 
  onClose 
}) => {
  const { mutate, isPending } = useDeleteSensor();

  const handleConfirmDelete = () => {
    mutate(
      { id: sensor.id },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footerButtons={[
        {
          label: isPending ? "Eliminando..." : "Eliminar",
          color: "success",
          variant: "light",
          onClick: handleConfirmDelete,
        },
      ]}
    >
      <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 p-3 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Eliminar el sensor "{sensor.tipo}"?
        </h3>
        
        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el sensor del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarSensorModal;
import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensor: {
    id: string;
    name: string;
    unit: string;
    currentValue: string;
    min?: number | null;
    max?: number | null;
  } | null;
  onSave: (sensorId: string, min: number | null, max: number | null) => void;
}

export const ThresholdModal = ({ isOpen, onClose, sensor, onSave }: ThresholdModalProps) => {
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  
  useEffect(() => {
    if (sensor) {
      setMinValue(sensor.min?.toString() || "");
      setMaxValue(sensor.max?.toString() || "");
    }
  }, [sensor]);

  const handleSave = () => {
    if (!sensor) return;
    
    onSave(
      sensor.id,
      minValue ? parseFloat(minValue) : null,
      maxValue ? parseFloat(maxValue) : null
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Configurar Umbrales - {sensor?.name}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Valor actual: {sensor?.currentValue} {sensor?.unit}</p>
            </div>
            
            <Input
              label="Umbral Mínimo"
              type="number"
              value={minValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinValue(e.target.value)}
              placeholder="Sin límite"
            />
            
            <Input
              label="Umbral Máximo"
              type="number"
              value={maxValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxValue(e.target.value)}
              placeholder="Sin límite"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
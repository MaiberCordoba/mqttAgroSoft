import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteControl } from "../../hooks/controles/useDeleteControles";
import { Controles } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarControlModalProps {
  control: Controles;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarControlModal: React.FC<EliminarControlModalProps> = ({ 
  control, 
  isOpen, 
  onClose,
}) => {
  const { mutate, isPending } = useDeleteControl();

  const handleConfirmDelete = () => {
    mutate(
      { id: control.id },
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
          label: isPending ? "Borrando..." : "Borrar",
          color: "danger",
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
          ¿Eliminar este control?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el control del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarControlModal;

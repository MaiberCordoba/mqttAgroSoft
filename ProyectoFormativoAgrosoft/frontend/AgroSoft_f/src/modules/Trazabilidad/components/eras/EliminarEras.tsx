import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteEras } from "../../hooks/eras/useDeleteEras";
import { Eras } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarEraModalProps {
  era: Eras;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarEraModal: React.FC<EliminarEraModalProps> = ({ era, isOpen, onClose }) => {
  const { mutate, isPending } = useDeleteEras();

  const handleConfirmDelete = () => {
    mutate(
      { id: era.id ?? 0 }, // Evita valores undefined
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
      title="Eliminar Era"
      footerButtons={[
        {
          label: isPending ? "Borrando..." : "Eliminar",
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
          ¿Eliminar la era del lote "{era.Lote.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente la era del sistema.
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarEraModal;

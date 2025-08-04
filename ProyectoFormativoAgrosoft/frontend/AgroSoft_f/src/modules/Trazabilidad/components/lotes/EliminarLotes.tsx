import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteLotes } from "../../hooks/lotes/useDeleteLotes";
import { Lotes } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarLoteModalProps {
  lote: Lotes;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarLoteModal: React.FC<EliminarLoteModalProps> = ({ lote, isOpen, onClose }) => {
  const { mutate, isPending } = useDeleteLotes();

  const handleConfirmDelete = () => {
    mutate(
      { id: lote.id ?? 0 },
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
          label: isPending ? "Borrando ..." : "Borrar",
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
          ¿Eliminar "{lote.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el lote del sistema.
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarLoteModal;

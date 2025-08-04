import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteUnidadesMedida } from "../../hooks/unidadesMedida/useDeleteUnidadesMedida";
import { UnidadesMedida } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarUnidadesMedidaModalProps {
  unidadMedida: UnidadesMedida;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarUnidadesMedidaModal: React.FC<EliminarUnidadesMedidaModalProps> = ({
  unidadMedida,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteUnidadesMedida();

  const handleConfirmDelete = () => {
    mutate(
      { id: unidadMedida.id },
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
          ¿Eliminar "{unidadMedida.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente la unidad de medida del sistema. 
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarUnidadesMedidaModal;

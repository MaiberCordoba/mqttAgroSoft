import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteTiposEspecie } from "../../hooks/tiposEspecie/useDeleteTiposEspecie";
import { TiposEspecie } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarTiposEspecieModalProps {
  especie: TiposEspecie;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarTiposEspecieModal: React.FC<EliminarTiposEspecieModalProps> = ({
  especie,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteTiposEspecie();

  const handleConfirmDelete = () => {
    mutate(
      { id: especie.id },
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
      title="Eliminar Tipo de Especie"
      footerButtons={[
        {
          label: isPending ? "Borrando..." : "Eliminar",
          color: "danger",
          variant: "solid",
          onClick: handleConfirmDelete,
        },
      ]}
    >
      <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 p-3 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Eliminar "{especie.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente este tipo de especie. No se podrá recuperar.
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarTiposEspecieModal;

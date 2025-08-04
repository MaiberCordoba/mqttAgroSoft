import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteSemilleros } from "../../hooks/semilleros/useDeleteSemilleros";
import { Semilleros } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarSemilleroModalProps {
  semillero: Semilleros;
  isOpen: boolean;
  onClose: () => void;
}

const EliminarSemilleroModal: React.FC<EliminarSemilleroModalProps> = ({
  semillero,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteSemilleros();

  const handleConfirmDelete = () => {
    mutate(
      { id: semillero.id },
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
          ¿Eliminar el semillero del cultivo "{semillero.cultivo.nombre}"?
        </h3>

        <p className="text-gray-500 mb-4 max-w-md">
          Esta acción eliminará permanentemente el semillero del sistema.
          ¿Estás seguro de continuar?
        </p>
      </div>
    </ModalComponent>
  );
};

export default EliminarSemilleroModal;

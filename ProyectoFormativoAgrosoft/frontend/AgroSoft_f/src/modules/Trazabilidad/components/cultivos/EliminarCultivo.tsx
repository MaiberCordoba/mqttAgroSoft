import React from "react";
import ModalComponent from "@/components/Modal";
import { useDeleteCultivos } from "../../hooks/cultivos/useDeleteCultivos";
import { Cultivo } from "../../types";
import { AlertCircle } from "lucide-react";

interface EliminarCultivoModalProps {
  cultivo?: Cultivo; // Se permite que cultivo sea opcional
  isOpen: boolean;
  onClose: () => void;
}

const EliminarCultivoModal: React.FC<EliminarCultivoModalProps> = ({
  cultivo,
  isOpen,
  onClose,
}) => {
  const { mutate, isPending } = useDeleteCultivos();

  const handleConfirmDelete = () => {
    if (!cultivo || cultivo.id === undefined) return; // 🔹 Evita errores

    mutate(
      { id: cultivo.id },
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

        {cultivo ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Eliminar el cultivo "{cultivo.nombre}"?
            </h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Esta acción eliminará permanentemente el cultivo del sistema.
              ¿Estás seguro de continuar?
            </p>
          </>
        ) : (
          <p className="text-gray-500">No se ha seleccionado un cultivo.</p>
        )}
      </div>
    </ModalComponent>
  );
};

export default EliminarCultivoModal;

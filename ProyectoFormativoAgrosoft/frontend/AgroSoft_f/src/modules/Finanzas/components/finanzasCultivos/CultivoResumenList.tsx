// components/CultivoResumenList.tsx
import { Button, Spinner } from "@heroui/react";
import { ResumenEconomicoListado } from "../../types";
import { CultivoResumenCard } from "./CultivoResumenCard";

interface CultivoResumenListProps {
  resumenes: ResumenEconomicoListado[];
  loading?: boolean;
  onSelectCultivo: (cultivoId: number) => void; // Ahora espera un number
  onOpenHistorial: (cultivo: ResumenEconomicoListado) => void;
}

export const CultivoResumenList = ({
  resumenes,
  loading,
  onSelectCultivo,
}: CultivoResumenListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (resumenes.length === 0) {
    return (
      <div className="text-center py-8 text-default-500">
        No se encontraron resúmenes económicos
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumenes.map((resumen) => (
        <div className="flex justify-between items-center">
          <CultivoResumenCard
            key={resumen.cultivo_id}
            resumen={resumen}
            onSelect={() => onSelectCultivo(resumen.cultivo_id)} // Pasamos solo el ID
          />
        </div>
      ))}
    </div>
  );
};

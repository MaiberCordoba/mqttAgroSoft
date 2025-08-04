import { FiltroFecha } from "@/components/ui/filtroFecha";
import { Especies, TiposEspecie } from "@/modules/Trazabilidad/types";
import { Select, SelectItem, Button } from "@heroui/react";

interface FiltrosCultivosProps {
  tiposEspecie: TiposEspecie[];
  especies: Especies[];
  tipoEspecieId: number | null;
  especieId: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  onTipoEspecieChange: (id: number | null) => void;
  onEspecieChange: (id: number | null) => void;
  onFechaChange: (filtros: {
    fechaInicio: string | null;
    fechaFin: string | null;
  }) => void;
  onReset: () => void;
  onOpenHistorial: () => void; // Nuevo prop para manejar el botón
}

export const FiltrosCultivos = ({
  tiposEspecie,
  especies,
  tipoEspecieId,
  especieId,
  fechaInicio,
  fechaFin,
  onTipoEspecieChange,
  onEspecieChange,
  onFechaChange,
  onReset,
  onOpenHistorial,
}: FiltrosCultivosProps) => {
  const especiesFiltradas = tipoEspecieId
    ? especies.filter((especie) => especie.fk_tipoespecie === tipoEspecieId)
    : especies;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Filtro por Tipo de Especie */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Tipo de Especie"
            placeholder="Selecciona un tipo"
            selectedKeys={tipoEspecieId ? [tipoEspecieId.toString()] : []}
            onChange={(e) =>
              onTipoEspecieChange(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            size="sm"
          >
            {tiposEspecie.map((tipo) => (
              <SelectItem key={tipo.id}>{tipo.nombre}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Filtro por Especie */}
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Especie"
            placeholder="Selecciona una especie"
            isDisabled={!tipoEspecieId}
            selectedKeys={especieId ? [especieId.toString()] : []}
            onChange={(e) =>
              onEspecieChange(e.target.value ? parseInt(e.target.value) : null)
            }
            size="sm"
          >
            {especiesFiltradas.map((especie) => (
              <SelectItem key={especie.id}>{especie.nombre}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Filtro por Fecha de Siembra */}
        <div className="flex-1 min-w-[200px]">
          <FiltroFecha
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onChange={onFechaChange}
            onLimpiar={() =>
              onFechaChange({ fechaInicio: null, fechaFin: null })
            }
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <Button
            color="default"
            onPress={onReset}
            isDisabled={
              !tipoEspecieId && !especieId && !fechaInicio && !fechaFin
            }
            size="sm"
          >
            Limpiar
          </Button>
          <Button color="success" size="sm" onPress={onOpenHistorial}>
            Ver Historial General
          </Button>
        </div>
      </div>
    </div>
  );
};

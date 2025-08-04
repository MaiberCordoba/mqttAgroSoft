import React from 'react';
import { Button, Input, Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { Calendar } from 'lucide-react';

interface FiltroFechaProps {
  fechaInicio: string | null;
  fechaFin: string | null;
  onChange: (filtros: { fechaInicio: string | null; fechaFin: string | null }) => void;
  onLimpiar: () => void;
}

export const FiltroFecha: React.FC<FiltroFechaProps> = ({
  fechaInicio,
  fechaFin,
  onChange,
  onLimpiar
}) => {
  const [mostrarPopover, setMostrarPopover] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <Popover isOpen={mostrarPopover} onOpenChange={setMostrarPopover}>
        <PopoverTrigger>
          <Button
            size="sm"
            endContent={<Calendar className="text-gray-400" width={16} height={16} />}
          >
            Rango de fechas
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-[300px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Desde:</label>
              <Input
                type="date"
                value={fechaInicio || ''}
                onChange={(e) => onChange({
                  fechaInicio: e.target.value || null,
                  fechaFin
                })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Hasta:</label>
              <Input
                type="date"
                value={fechaFin || ''}
                onChange={(e) => onChange({
                  fechaInicio,
                  fechaFin: e.target.value || null
                })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  onLimpiar();
                  setMostrarPopover(false);
                }}
              >
                Limpiar
              </Button>
              <Button
                size="sm"
                color="primary"
                onPress={() => setMostrarPopover(false)}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {fechaInicio || fechaFin ? (
        <span className="text-xs text-default-500">
          {fechaInicio && `Desde: ${fechaInicio}`} 
          {fechaFin && ` Hasta: ${fechaFin}`}
        </span>
      ) : null}
    </div>
  );
};
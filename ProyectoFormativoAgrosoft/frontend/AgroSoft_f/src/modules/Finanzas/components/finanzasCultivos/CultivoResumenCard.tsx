import { Card, CardHeader, CardBody, Image, Chip } from "@heroui/react";
import { ResumenEconomicoListado } from "../../types";

interface CultivoResumenCardProps {
  resumen: ResumenEconomicoListado;
  onSelect?: () => void;
}

export const CultivoResumenCard = ({ resumen, onSelect }: CultivoResumenCardProps) => {
  // Determinar el color basado en el beneficio
  const beneficioColor = resumen.beneficio >= 0 ? "success" : "danger";
  const relacionColor = resumen.relacion_beneficio_costo >= 1 ? "success" : "warning";

  return (
    <Card 
      className="w-full max-w-[400px] hover:shadow-lg transition-shadow cursor-pointer"
      isPressable
      onPress={onSelect} 
    >
      <CardHeader className="flex justify-between items-start gap-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold truncate">
            {resumen.nombre_especie || "Sin nombre"}
          </h3>
          <p className="text-small text-default-500">
            Siembra: {resumen.fecha_siembra || "No registrada"}
          </p>
        </div>
        
        <Chip color={beneficioColor} variant="flat">
          {resumen.beneficio >= 0 ? "Ganancia" : "Pérdida"}
        </Chip>
      </CardHeader>

      <CardBody className="grid grid-cols-2 gap-4">
        {/* Columna izquierda - Datos financieros */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Ingresos:</span>
            <span className="font-semibold">
              ${resumen.total_ventas.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-default-500">Egresos:</span>
            <span className="font-semibold">
              ${resumen.total_costos.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Beneficio:</span>
            <Chip 
              color={beneficioColor} 
              size="sm" 
              className="font-bold"
            >
              ${Math.abs(resumen.beneficio).toLocaleString()}
            </Chip>
          </div>
        </div>

        {/* Columna derecha - Relación B/C e imagen */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-center">
            <p className="text-xs text-default-500">Relación B/C</p>
            <Chip 
              color={relacionColor} 
              size="lg" 
              className="font-bold text-lg"
            >
              {resumen.relacion_beneficio_costo.toFixed(2)}
            </Chip>
          </div>
          
          {/* Espacio reservado para imagen */}
          <div className="w-20 h-20 bg-default-100 rounded-lg flex items-center justify-center">
            <span className="text-xs text-default-400">Imagen especie</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
import React, { useState, useMemo, memo, useEffect } from "react";
import { es } from "date-fns/locale";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
} from "@heroui/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Point,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useHistorialBeneficioCosto } from "../../hooks/finanzasCultivos/useHistorialBeneficioCosto";
import { Cultivo } from "@/modules/Trazabilidad/types";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cultivoId?: number;
  cultivoNombre?: string | null;
}

interface HistorialBeneficioCosto {
  cultivo_id: number;
  nombre_cultivo: string;
  fecha_registro: string;
  costo_insumos: number;
  total_mano_obra: number;
  total_costos: number;
  total_ventas: number;
  beneficio: number;
  relacion_beneficio_costo: number;
}

const HistorialBeneficioCostoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cultivoId,
  cultivoNombre,
}) => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [cultivosIds, setCultivosIds] = useState<number[]>([]);

  // Efecto para inicializar con el cultivoId
  useEffect(() => {
    if (cultivoId && !cultivosIds.includes(cultivoId)) {
      setCultivosIds((prev) => [...prev, cultivoId]);
    }
  }, [cultivoId]);

  const { data: cultivos } = useGetCultivos();
  const {
    data: historial,
    isLoading,
    error,
  } = useHistorialBeneficioCosto({
    cultivosIds,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  });

  // Stabilize chartData
  const chartData: ChartData<"line", Point[]> = useMemo(() => {
    if (!historial || historial.length === 0) return { datasets: [] };

    const datasets = cultivosIds.map((id, index) => {
      const cultivoData = historial
        .filter((registro) => registro.cultivo_id === id)
        .sort(
          (a, b) =>
            new Date(a.fecha_registro).getTime() -
            new Date(b.fecha_registro).getTime()
        );
      const cultivo = cultivos?.find((c: Cultivo) => c.id === id);

      return {
        label: cultivo?.nombre || `Cultivo ${id}`,
        data: cultivoData.map((registro) => ({
          x: new Date(registro.fecha_registro).getTime(),
          y: registro.relacion_beneficio_costo,
        })),
        borderColor: `hsl(${index * 60}, 70%, 50%)`,
        backgroundColor: `hsl(${index * 60}, 70%, 50%, 0.2)`,
        fill: false,
        tension: 0.3,
        pointRadius: 5, // Tamaño de los puntos para facilitar la interacción
        pointHitRadius: 10, // Área de interacción para tooltips
      };
    });

    return { datasets };
  }, [historial, cultivosIds, cultivos]);

  // Stabilize chartOptions
  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "dd MMM",
              week: "dd MMM",
              month: "MMM yyyy",
            },
            tooltipFormat: "dd MMM yyyy - HH:mm",
          },
          adapters: {
            date: {
              locale: es,
            },
          },
          title: {
            display: true,
            text: "Fecha",
            font: { weight: "bold" },
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
            source: "auto",
            color: "#666",
            font: {
              size: 12,
            },
          },
          grid: {
            color: "#f0f0f0",
          },
        },
        y: {
          type: "linear",
          title: { display: true, text: "Relación Beneficio-Costo" },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: !cultivoId },
        tooltip: {
          enabled: true,
          mode: "nearest",
          intersect: false,
          callbacks: {
            title: (context) => {
              const date = new Date(context[0].parsed.x);
              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            },
            label: (context) => {
              return `${context.dataset.label}: Relación B/C: ${context.parsed.y.toFixed(2)}`;
            },
          },
        },
      },
      // Eliminamos events: [] para habilitar interacciones
      animation: false,
    }),
    [cultivoId]
  );

  // Prevent unnecessary state updates
  const handleCultivoChange = (value: string[]) => {
    const selectedIds = value.map((id) => parseInt(id));
    if (JSON.stringify(selectedIds) !== JSON.stringify(cultivosIds)) {
      setCultivosIds(selectedIds);
    }
  };

  // Debug modal lifecycle and state
  useEffect(() => {
    console.log("Modal isOpen:", isOpen, new Date());
    return () => console.log("Modal unmounting:", new Date());
  }, [isOpen]);

  useEffect(() => {
    console.log(
      "State changed:",
      { cultivosIds, fechaInicio, fechaFin, cultivoId },
      new Date()
    );
  }, [cultivosIds, fechaInicio, fechaFin, cultivoId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent className="max-h-[90vh] rounded-xl">
        <ModalHeader className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold">
            Historial Beneficio-Costo:{" "}
            {cultivoId ? cultivoNombre || "Cultivo" : "Comparación"}
          </h2>
        </ModalHeader>

        <ModalBody className="p-6 overflow-y-auto">
          {!cultivoId && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                type="date"
                label="Fecha Inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <Input
                type="date"
                label="Fecha Fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              <Select
                label="Cultivos"
                selectionMode="multiple"
                selectedKeys={cultivosIds.map(String)}
                onSelectionChange={(keys) =>
                  handleCultivoChange(Array.from(keys) as string[])
                }
              >
                {cultivos?.length ? (
                  cultivos.map((cultivo: Cultivo) => (
                    <SelectItem key={cultivo.id}>{cultivo.nombre}</SelectItem>
                  ))
                ) : (
                  <SelectItem key="empty" isDisabled>
                    No hay cultivos disponibles
                  </SelectItem>
                )}
              </Select>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Gráfico de Relación Beneficio-Costo
            </h3>
            {isLoading ? (
              <p>Cargando gráfica...</p>
            ) : error ? (
              <p className="text-danger-500">Error: {error.message}</p>
            ) : historial && historial.length > 0 ? (
              <div
                className="bg-default-50 p-4 rounded-lg"
                style={{ minHeight: "300px" }}
              >
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-default-500">
                No hay datos para mostrar en el gráfico.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Datos Históricos</h3>
            {isLoading && <p>Cargando historial...</p>}
            {error && <p className="text-danger-500">Error: {error.message}</p>}
            {historial && historial.length > 0 ? (
              <Table aria-label="Historial de beneficio-costo">
                <TableHeader>
                  <TableColumn>Cultivo</TableColumn>
                  <TableColumn>Fecha</TableColumn>
                  <TableColumn>Costo Insumos</TableColumn>
                  <TableColumn>Mano de Obra</TableColumn>
                  <TableColumn>Total Costos</TableColumn>
                  <TableColumn>Total Ventas</TableColumn>
                  <TableColumn>Beneficio</TableColumn>
                  <TableColumn>Relación B/C</TableColumn>
                </TableHeader>
                <TableBody>
                  {historial
                    .filter((registro) =>
                      cultivosIds.includes(registro.cultivo_id)
                    )
                    .map((registro: HistorialBeneficioCosto, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{registro.nombre_cultivo}</TableCell>
                        <TableCell>
                          {new Date(registro.fecha_registro).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          ${registro.costo_insumos.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${registro.total_mano_obra.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${registro.total_costos.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${registro.total_ventas.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${registro.beneficio.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {registro.relacion_beneficio_costo.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-default-500">
                No hay datos históricos disponibles.
              </p>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="px-6 pb-4 pt-2">
          <Button color="danger" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(HistorialBeneficioCostoModal);

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  SortDescriptor,
} from "@heroui/react";
import { useFiltrado } from "../../../hooks/useFiltrado";
import { useFilasPorPagina } from "../../../hooks/useFilasPorPagina";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useColumnasVisibles } from "@/hooks/useColumnasVisibles";
import { FiltrosTabla } from "./FiltrosTabla";
import { FilasPorPagina } from "./filasPorPagina";
import { PaginacionTabla } from "./PaginacionTabla";
import { PlusIcon } from "lucide-react";
import { SelectorColumnas } from "./SelectorDeColumnas";

interface TablaReutilizableProps<T extends { [key: string]: any }> {
  datos: T[];
  columnas: { name: string; uid: string; sortable?: boolean }[];
  claveBusqueda: keyof T;
  opcionesEstado?: { uid: string; nombre: string }[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  onCrearNuevo?: () => void;
  onRegistroMasivo?: () => void;
  placeholderBusqueda?: string;
  initialVisibleColumns?: string[];
  renderReporteAction?: (data: T[]) => React.ReactNode;
  botonExtra?: React.ReactNode;
}

export const TablaReutilizable = <T extends { [key: string]: any }>({
  renderReporteAction,
  datos,
  columnas,
  claveBusqueda,
  opcionesEstado = [],
  renderCell,
  onCrearNuevo,
  onRegistroMasivo,
  placeholderBusqueda = "Buscar...",
  initialVisibleColumns = columnas.map((c) => c.uid),
  botonExtra,
}: TablaReutilizableProps<T>) => {
  const {
    valorFiltro,
    setValorFiltro,
    filtroEstado,
    setFiltroEstado,
    datosFiltrados,
  } = useFiltrado(datos, claveBusqueda);

  const { filasPorPagina, handleChangeFilasPorPagina } = useFilasPorPagina(5);
  const { paginaActual, setPaginaActual, totalPaginas, datosPaginados } =
    usePaginacion(datosFiltrados, filasPorPagina);

  const { visibleColumns, setVisibleColumns } = useColumnasVisibles(
    initialVisibleColumns
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columnas;
    return columnas.filter((col) =>
      Array.from(visibleColumns).includes(col.uid)
    );
  }, [visibleColumns, columnas]);

  const sortedItems = React.useMemo(() => {
    return [...datosPaginados].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];
      const cmp = String(first).localeCompare(String(second));
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [datosPaginados, sortDescriptor]);

  return (
    <div className="w-full max-w-[1400px] flex flex-col gap-3 mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center w-full">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="w-full sm:w-[250px]">
            <FiltrosTabla
              valorFiltro={valorFiltro}
              onCambiarBusqueda={setValorFiltro}
              onLimpiarBusqueda={() => setValorFiltro("")}
              opcionesEstado={opcionesEstado}
              filtroEstado={filtroEstado}
              onCambiarFiltroEstado={setFiltroEstado}
              placeholderBusqueda={placeholderBusqueda}
            />
          </div>
          <div className="w-full sm:w-[120px]">
            <FilasPorPagina
              filasPorPagina={filasPorPagina}
              onChange={handleChangeFilasPorPagina}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="w-full sm:w-[120px]">
            <SelectorColumnas
              columnas={columnas}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {botonExtra && <div>{botonExtra}</div>}
            {onCrearNuevo && (
              <Button
                color="success"
                size="sm"
                endContent={<PlusIcon size={16} />}
                onPress={onCrearNuevo}
                className="text-white"
              >
                Agregar
              </Button>
            )}
            {onRegistroMasivo && (
              <Button
                color="success"
                size="sm"
                endContent={<PlusIcon size={16} />}
                onPress={onRegistroMasivo}
                className="text-white"
              >
                Registro masivo
              </Button>
            )}
            {renderReporteAction && renderReporteAction(datos)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <Table
          className="min-w-[600px]"
          aria-label="Tabla reutilizable"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="sticky left-0 z-3 bg-[#e6f1ed]"
                align={column.uid === "acciones" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  No se encontraron registros
                </p>
                <Button size="sm" variant="flat" onPress={onCrearNuevo}>
                  Crear nuevo registro
                </Button>
              </div>
            }
          >
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="py-3 px-4 border-b text-gray-700">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="[&>div]:justify-center [&>div]:sm:justify-between">
        <PaginacionTabla
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>
    </div>
  );
};

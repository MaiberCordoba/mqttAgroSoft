import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { DetalleControl } from "../../types";
import { ModalFiltrable } from "./tablaFiltrable";

interface ControlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  controles: DetalleControl[];
}

export const ControlesModal = ({ isOpen, onClose, controles }: ControlesModalProps) => {
  const datosTransformados = controles.flatMap(control => 
    control.insumos.map(insumo => ({
      ...control,
      insumo
    }))
  );

  return (
    <ModalFiltrable
      isOpen={isOpen}
      onClose={onClose}
      datos={datosTransformados}
      textoBusquedaPlaceholder="Buscar controles o insumos..."
    >
      <Table className="w-full">
        <TableHeader>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Tipo Control</TableColumn>
          <TableColumn>Plaga</TableColumn>
          <TableColumn>Tiempo (h)</TableColumn>
          <TableColumn>Costo MO</TableColumn>
          <TableColumn>Total Insumos</TableColumn>
          <TableColumn>Insumo</TableColumn>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Unidad</TableColumn>
        </TableHeader>
        <TableBody>
          {datosTransformados.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.descripcion}</TableCell>
              <TableCell>{item.fecha}</TableCell>
              <TableCell>{item.tipo_control || '-'}</TableCell>
              <TableCell>{item.plaga || '-'}</TableCell>
              <TableCell>{item.tiempo_total}</TableCell>
              <TableCell>${item.costo_mano_obra.toLocaleString()}</TableCell>
              <TableCell>${item.total_insumos_control.toLocaleString()}</TableCell>
              <TableCell>{item.insumo.nombre}</TableCell>
              <TableCell>{item.insumo.cantidad}</TableCell>
              <TableCell>{item.insumo.unidad || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalFiltrable>
  );
};
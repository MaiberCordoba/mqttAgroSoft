import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { DetalleVenta } from "../../types";
import { ModalFiltrable } from "./tablaFiltrable";

interface VentasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventas: DetalleVenta[];
}

export const VentasModal = ({ isOpen, onClose, ventas }: VentasModalProps) => {
  return (
    <ModalFiltrable
      isOpen={isOpen}
      onClose={onClose}
      datos={ventas}
      textoBusquedaPlaceholder="Buscar ventas..."
    >
      <Table className="w-full">
        <TableHeader>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Unidad</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Valor Total</TableColumn>
        </TableHeader>
        <TableBody>
          {ventas.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>{item.unidad || '-'}</TableCell>
              <TableCell>{item.fecha}</TableCell>
              <TableCell>${item.valor_total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalFiltrable>
  );
};
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { DetalleCosecha } from "../../types";
import { ModalFiltrable } from "./tablaFiltrable";

interface CosechasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechas: DetalleCosecha[];
}

export const CosechasModal = ({ isOpen, onClose, cosechas }: CosechasModalProps) => {
  return (
    <ModalFiltrable
      isOpen={isOpen}
      onClose={onClose}
      datos={cosechas}
      textoBusquedaPlaceholder="Buscar cosechas..."
    >
      <Table className="w-full">
        <TableHeader>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Unidad</TableColumn>
          <TableColumn>Fecha</TableColumn>
        </TableHeader>
        <TableBody>
          {cosechas.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>{item.unidad || '-'}</TableCell>
              <TableCell>{item.fecha}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalFiltrable>
  );
};
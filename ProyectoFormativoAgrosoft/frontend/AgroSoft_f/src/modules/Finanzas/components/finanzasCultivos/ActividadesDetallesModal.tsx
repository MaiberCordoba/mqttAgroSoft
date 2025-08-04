
import { DetalleActividad } from "../../types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { ModalFiltrable } from "./tablaFiltrable";

interface ActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividades: DetalleActividad[];
}

export const ActividadesModal = ({ isOpen, onClose, actividades }: ActividadesModalProps) => {
  const datosTransformados = actividades.flatMap(actividad => 
    actividad.insumos.map(insumo => ({
      ...actividad,
      insumo
    }))
  );

  return (
    <ModalFiltrable
      isOpen={isOpen}
      onClose={onClose}
      datos={datosTransformados}
      textoBusquedaPlaceholder="Buscar actividades..."
    >
      <Table  className="w-full">
        <TableHeader>
          <TableColumn >Tipo</TableColumn>
          <TableColumn>Responsable</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn  style={{ width: '80px', textAlign:"center" }}>Tiempo (h)</TableColumn>
          <TableColumn>Costo MO</TableColumn>
          <TableColumn>Costo Insumo</TableColumn>
          <TableColumn>Nombre Insumo</TableColumn>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Unidad</TableColumn>
        </TableHeader>
        <TableBody>
          {datosTransformados.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.tipo_actividad || '-'}</TableCell>
              <TableCell>{item.responsable || '-'}</TableCell>
              <TableCell>{item.fecha}</TableCell>
              <TableCell  style={{ width: '80px', textAlign:"center" }}>{item.tiempo_total}</TableCell>
              <TableCell>${item.costo_mano_obra.toLocaleString()}</TableCell>
              <TableCell>${item.insumo.costo.toLocaleString()}</TableCell>
              <TableCell>{item.insumo.nombre}</TableCell>
              <TableCell style={{ width: '80px', textAlign:"center" }}>{item.insumo.cantidad}</TableCell>
              <TableCell>{item.insumo.unidad || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalFiltrable>
  );
};
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { VerticalDotsIcon } from "./Icons";

interface AccionesTablaProps {
  onEditar: () => void;
  onEliminar?: () => void; // Hacer onEliminar opcional
  permitirEditar?: boolean;
  permitirEliminar?: boolean;
  onVerDetalles?: () => void;
}

export const AccionesTabla: React.FC<AccionesTablaProps> = ({
  onEditar,
  onEliminar,
  permitirEditar = true,
  permitirEliminar = true,
  onVerDetalles,
}) => {
  // Crear elementos de menú de forma condicional
  const menuItems = React.useMemo(() => {
    const items = [];

    if (onVerDetalles) {
      items.push(
        <DropdownItem key="ver" onPress={onVerDetalles}>
          Ver detalles
        </DropdownItem>
      );
    }

    if (permitirEditar) {
      items.push(
        <DropdownItem key="editar" onPress={onEditar}>
          Editar
        </DropdownItem>
      );
    }

    // Solo agregar "Eliminar" si onEliminar está definido y permitirEliminar es true
    if (onEliminar && permitirEliminar) {
      items.push(
        <DropdownItem key="eliminar" onPress={onEliminar}>
          Eliminar
        </DropdownItem>
      );
    }

    return items;
  }, [onVerDetalles, permitirEditar, permitirEliminar, onEditar, onEliminar]);

  // Si no hay acciones disponibles
  if (menuItems.length === 0) {
    return <span className="text-gray-400 text-sm">Sin acciones</span>;
  }

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" className="bg-success p-2 rounded">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Acciones">{menuItems}</DropdownMenu>
      </Dropdown>
    </div>
  );
};

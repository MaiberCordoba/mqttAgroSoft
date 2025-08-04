import React from "react";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon } from "./Icons";

interface OpcionEstado {
  uid: string;
  nombre: string;
}

interface FiltrosTablaProps {
  valorFiltro: string;
  onCambiarBusqueda: (valor: string) => void;
  onLimpiarBusqueda: () => void;
  opcionesEstado?: OpcionEstado[];
  filtroEstado: Set<string>;
  onCambiarFiltroEstado: (filtro: Set<string>) => void;
  placeholderBusqueda?: string;
}

export const FiltrosTabla: React.FC<FiltrosTablaProps> = ({
  valorFiltro,
  onCambiarBusqueda,
  onLimpiarBusqueda,
  opcionesEstado,
  filtroEstado,
  onCambiarFiltroEstado,
  placeholderBusqueda = "Buscar por nombre...",
}) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <Input
        isClearable
        endContent={
          <ChevronDownIcon className="text-gray-400" width={16} height={16} />
        }
        className="w-full"
        placeholder={placeholderBusqueda}
        startContent={<SearchIcon className="text-default-400" />}
        value={valorFiltro}
        onClear={onLimpiarBusqueda}
        onValueChange={onCambiarBusqueda}
        size="sm"
      />
      {opcionesEstado && opcionesEstado.length > 0 && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={
                <ChevronDownIcon
                  className="text-gray-400"
                  width={16}
                  height={16}
                />
              }
              variant="flat"
              size="sm"
              className="w-auto"
            >
              Estado
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Status filter"
            closeOnSelect={false}
            selectedKeys={filtroEstado}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              const keysSet = new Set(Array.from(keys).map(String));
              onCambiarFiltroEstado(keysSet);
            }}
          >
            {opcionesEstado.map((estado) => (
              <DropdownItem key={estado.uid} className="capitalize">
                {estado.nombre}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

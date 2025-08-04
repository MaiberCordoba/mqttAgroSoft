import React from "react";
import { Select, SelectItem } from "@heroui/react";

interface FilasPorPaginaProps {
  filasPorPagina: number;
  onChange: (value: number) => void;
}

export const FilasPorPagina: React.FC<FilasPorPaginaProps> = ({
  filasPorPagina,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-default-400 text-small whitespace-nowrap">
        Filas:
      </span>
      <Select
        aria-label="Filas por página"
        selectedKeys={[String(filasPorPagina)]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          onChange(Number(selected));
        }}
        variant="flat"
        size="sm"
        className="w-[70px]"
      >
        <SelectItem key="5">5</SelectItem>
        <SelectItem key="10">10</SelectItem>
        <SelectItem key="15">15</SelectItem>
      </Select>
    </div>
  );
};

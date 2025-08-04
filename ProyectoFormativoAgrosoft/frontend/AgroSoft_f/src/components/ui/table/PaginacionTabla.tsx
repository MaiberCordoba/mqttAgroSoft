import React from "react";
import { Button, Pagination } from "@heroui/react";

interface PaginacionTablaProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export const PaginacionTabla: React.FC<PaginacionTablaProps> = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  return (
    <div className="py-4 px-4 flex justify-between items-center bg-white shadow-sm rounded-lg">
      <span className="w-[30%] text-small text-gray-500">
        {`Página ${paginaActual} de ${totalPaginas}`}
      </span>

      <Pagination
        isCompact
        showControls
        showShadow
        color="success"
        page={paginaActual}
        total={totalPaginas}
        onChange={onCambiarPagina}
        className="mx-4  text-white"
      />

      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={paginaActual === 1}
          size="sm"
          variant="flat"
          onPress={() => onCambiarPagina(paginaActual - 1)}
          className="bg-white shadow-sm"
        >
          Anterior
        </Button>
        <Button
          isDisabled={paginaActual === totalPaginas}
          size="sm"
          variant="flat"
          onPress={() => onCambiarPagina(paginaActual + 1)}
          className="bg-white shadow-sm"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
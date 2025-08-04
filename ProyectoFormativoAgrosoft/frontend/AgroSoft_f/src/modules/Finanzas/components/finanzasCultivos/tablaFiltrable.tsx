import { FiltroFecha } from "@/components/ui/filtroFecha";
import { FilasPorPagina } from "@/components/ui/table/filasPorPagina";
import { PaginacionTabla } from "@/components/ui/table/PaginacionTabla";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Input } from "@heroui/react";

import { SearchCheckIcon } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ModalFiltrableProps {
  isOpen: boolean;
  onClose: () => void;
  datos: any[];
  textoBusquedaPlaceholder?: string;
  children: React.ReactNode;
}

export const ModalFiltrable = ({
  isOpen,
  onClose,
  datos,
  textoBusquedaPlaceholder = 'Buscar...',
  children
}: ModalFiltrableProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(10);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [rangoFechas, setRangoFechas] = useState({
    fechaInicio: null as string | null,
    fechaFin: null as string | null
  });

  const datosFiltrados = useMemo(() => {
    let resultado = [...datos];

    if (textoBusqueda) {
      const busqueda = textoBusqueda.toLowerCase();
      resultado = resultado.filter(item =>
        Object.values(item).some(val => 
          val?.toString().toLowerCase().includes(busqueda)
        )
      );
    }

    if (rangoFechas.fechaInicio || rangoFechas.fechaFin) {
      resultado = resultado.filter(item => {
        if (!item.fecha) return true;
        const fechaItem = new Date(item.fecha);
        const inicio = rangoFechas.fechaInicio ? new Date(rangoFechas.fechaInicio) : null;
        const fin = rangoFechas.fechaFin ? new Date(rangoFechas.fechaFin) : null;
        
        return (!inicio || fechaItem >= inicio) && 
               (!fin || fechaItem <= new Date(fin.setHours(23, 59, 59, 999)));
      });
    }

    return resultado;
  }, [datos, textoBusqueda, rangoFechas]);

  const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
  const datosPagina = datosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" className="overflow-hidden">
      <ModalContent className="max-h-[90vh] flex flex-col ">
        {/* Header con Filtros */}
        <ModalHeader className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              isClearable
              className="flex-1 min-w-[300px]"
              placeholder={textoBusquedaPlaceholder}
              startContent={<SearchCheckIcon className="text-gray-400" />}
              value={textoBusqueda}
              onClear={() => setTextoBusqueda('')}
              onValueChange={setTextoBusqueda}
            />
            
            <FiltroFecha
              fechaInicio={rangoFechas.fechaInicio}
              fechaFin={rangoFechas.fechaFin}
              onChange={setRangoFechas}
              onLimpiar={() => setRangoFechas({ fechaInicio: null, fechaFin: null })}
            />

            <FilasPorPagina
              filasPorPagina={filasPorPagina}
              onChange={setFilasPorPagina}
            />
          </div>
        </ModalHeader>

        {/* Cuerpo personalizado */}
        <ModalBody className="flex-1 overflow-auto p-4">
          <div className="p-4">
            {children}
          </div>
        </ModalBody>

        {/* Footer con Paginación */}
        <ModalFooter className="bg-gray-50 p-4 border-t w-full">
            <div className="w-full">
              <PaginacionTabla
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiarPagina={setPaginaActual}
               />
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
import React, { useEffect, useState } from "react";
import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

import { PDFViewer } from "@react-pdf/renderer";
import { Download, X } from "lucide-react";
import { ReportePdfPlantaciones } from "./ReportePdfPlantaciones";

export function PlantacionesList() {
  const { data, isLoading, error } = useGetPlantaciones();
  const [filteredData, setFilteredData] = useState<Plantaciones[]>([]);

  // Efecto para manejar los datos y posibles errores
  useEffect(() => {
    if (data) {
      console.log("Datos recibidos:", data);
      setFilteredData(data);
    }
    if (error) {
      console.error("Error al cargar plantaciones:", error);
    }
  }, [data, error]);

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    PlantacionesEditada,
    handleEditar,
  } = useEditarPlantaciones();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar,
  } = useEliminarPlantaciones();

  const [showPreview, setShowPreview] = useState(false);

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      cultivo: {
        id: 0,
        nombre: "",
        activo: false,
        fk_Especie: {
          id: 0,
          nombre: "",
        },
      },
      semillero: null,
      eras: {
        id: 0,
        tipo: "",
        fk_lote: {
          id: 0,
          nombre: "",
          descripcion: "",
          latI1: 0,
          longI1: 0,
          latS1: 0,
          longS1: 0,
          latI2: 0,
          longI2: 0,
          latS2: 0,
          longS2: 0,
          estado: null,
        },
        latI1: 0,
        longI1: 0,
        latS1: 0,
        longS1: 0,
        latI2: 0,
        longI2: 0,
        latS2: 0,
        longS2: 0,
      },
      unidades: 0,
      fechaSiembra: "",
      creado: "",
      fk_semillero: null,
      fk_Cultivo: 0,
      fk_Era: 0,
    });
  };

  const columnas = [
    { name: "Cultivo", uid: "cultivo", sortable: true },
    { name: "Semillero", uid: "semillero", sortable: false },
    { name: "Unidades", uid: "unidades", sortable: true },
    { name: "Fecha Siembra", uid: "fechaSiembra", sortable: true },
    { name: "Era - Lote", uid: "eras", sortable: true },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        return <span>{item.cultivo?.nombre || "No aplica"}</span>;
      case "semillero":
        return (
          <span>
            {item.semillero
              ? `Semillero: ${item.semillero.cultivo?.nombre || "Sin nombre"}`
              : "No aplica"}
          </span>
        );
      case "unidades":
        return <span>{item.unidades ?? "N/A"}</span>;
      case "fechaSiembra":
        return (
          <span>
            {item.fechaSiembra
              ? new Date(item.fechaSiembra).toLocaleDateString("es-CO")
              : "N/A"}
          </span>
        );
      case "eras":
        return (
          <span>
            {item.eras?.tipo ? (
              <>
                {item.eras.tipo}
                {" - "}
                {item.eras.Lote?.nombre ?? "Sin lote"}
              </>
            ) : (
              `Era ${item.eras?.id ?? "N/A"}`
            )}
          </span>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return (
          <span>{String(item[columnKey as keyof Plantaciones] ?? "N/A")}</span>
        );
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando plantaciones...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>Error al cargar las plantaciones</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
        <p className="text-sm mt-2">
          Detalle: {error?.message || "Error desconocido"}
        </p>
      </div>
    );
  }

  const datosConCultivoNombre = filteredData.map((item) => ({
    ...item,
    cultivoNombre: item.cultivo?.nombre?.toLowerCase() || "",
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Agrega un título para confirmar que el componente se renderiza */}
      <h2 className="text-xl font-semibold">Listado de Plantaciones</h2>

      {filteredData.length === 0 ? (
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700">
          <p>No se encontraron plantaciones registradas</p>
        </div>
      ) : (
        <TablaReutilizable
          datos={datosConCultivoNombre}
          columnas={columnas}
          claveBusqueda="cultivoNombre"
          placeholderBusqueda="Buscar por cultivo"
          renderCell={renderCell}
          onCrearNuevo={handleCrearNuevo}
          renderReporteAction={() => (
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 rounded-full hover:bg-red-100 transition-colors"
              title="Ver y descargar reporte"
              aria-label="Descargar reporte"
            >
              <Download className="h-5 w-5 text-red-600" />
            </button>
          )}
        />
      )}

      {showPreview && (
        <div className="border rounded mt-4 relative">
          <h2 className="text-sm font-semibold px-2 py-1 bg-gray-100 flex justify-between items-center">
            Vista previa del PDF
            <button
              onClick={() => setShowPreview(false)}
              className="text-red-500 font-bold px-2 hover:text-red-700"
              title="Cerrar previsualización"
            >
              <X />
            </button>
          </h2>
          <PDFViewer width="100%" height={600}>
            <ReportePdfPlantaciones plantaciones={data || []} />
          </PDFViewer>
        </div>
      )}

      {isEditModalOpen && PlantacionesEditada && (
        <EditarPlantacionModal
          plantacion={PlantacionesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearPlantacionModal onClose={closeCreateModal} onCreate={() => {}} />
      )}

      {isDeleteModalOpen && PlantacionesEliminada && (
        <EliminarPlantacionModal
          plantacion={PlantacionesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

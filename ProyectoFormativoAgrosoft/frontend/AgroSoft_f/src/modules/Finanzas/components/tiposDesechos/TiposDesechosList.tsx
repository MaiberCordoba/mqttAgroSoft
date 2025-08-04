import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";
import { useEditarTiposDesechos } from "../../hooks/tiposDesechos/useEditarTiposDesechos";
import { useCrearTiposDesechos } from "../../hooks/tiposDesechos/useCrearTiposDesechos";
import { useEliminarTiposDesechos } from "../../hooks/tiposDesechos/useEliminarTiposDesechos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTiposDesechosModal from "./EditarTiposDesechosModal";
import { CrearTiposDesechosModal } from "./CrearTiposDesechosModal";
import EliminarTiposDesechosModal from "./EliminarTiposDesechos";
import { TiposDesechos } from "../../types";

export function TiposDesechosList() {
  const { data, isLoading, error } = useGetTiposDesechos();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    tiposDesechosEditada, 
    handleEditar 
  } = useEditarTiposDesechos();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearTiposDesechos();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tiposDesechosEliminada,
    handleEliminar
  } = useEliminarTiposDesechos();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: ""});
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: TiposDesechos, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TiposDesechos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de desechos</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable directa */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && tiposDesechosEditada && (
        <EditarTiposDesechosModal
          tipoDesecho={tiposDesechosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTiposDesechosModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && tiposDesechosEliminada && (
        <EliminarTiposDesechosModal
          tipoDesecho={tiposDesechosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
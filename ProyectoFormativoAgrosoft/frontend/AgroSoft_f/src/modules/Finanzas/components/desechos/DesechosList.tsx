import { useGetDesechos } from "../../hooks/desechos/useGetDesechos";
import { useEditarDesecho } from "../../hooks/desechos/useEditarDesechos";
import { useCrearDesecho } from "../../hooks/desechos/useCrearDesechos";
import { useEliminarDesecho } from "../../hooks/desechos/useEliminarDesechos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarDesechosModal from "./EditarDesechosModal";
import { CrearDesechosModal } from "./CrearDesechosModal";
import EliminarDesechoModal from "./EliminarDesechos";
import { Desechos } from "../../types";
import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";

export function DesechosList() {
  const { data, isLoading, error } = useGetDesechos();
  const { data : plantacion, isLoading: loadingPlantacion } = useGetPlantaciones()
  const { data : tiposDesechos, isLoading: loadingTiposDesechos } = useGetTiposDesechos()

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    desechoEditado, 
    handleEditar 
  } = useEditarDesecho();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearDesecho();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    desechoEliminado,
    handleEliminar
  } = useEliminarDesecho();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Plantacion: 0,fk_TipoDesecho: 0,nombre: "", descripcion: ""});
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Plantacion", uid: "plantacion"  },
    { name: "Tipo Desecho", uid: "tipoDesecho" },
    { name: "Nombre", uid: "nombre" },
    { name: "Descripcion", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: Desechos, columnKey: React.Key) => {
    switch (columnKey) {
      case "plantacion":
        const plantaciones = plantacion?.find((c) => c.id === item.fk_Plantacion);
        return <span>Plantacion de: {plantaciones ? plantaciones.cultivo.nombre : "No definido"}</span>;
      case "tipoDesecho":
        const tipoDesecho = tiposDesechos?.find((c) => c.id === item.fk_TipoDesecho);
        return <span>{tipoDesecho ? tipoDesecho.nombre : "No definido"}</span>;
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
        return <span>{String(item[columnKey as keyof Desechos])}</span>;
    }
  };

  if (isLoading || loadingPlantacion || loadingTiposDesechos) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Desechos</p>;

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
      {isEditModalOpen && desechoEditado && (
        <EditarDesechosModal
          desecho={desechoEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearDesechosModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && desechoEliminado && (
        <EliminarDesechoModal
          desecho={desechoEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
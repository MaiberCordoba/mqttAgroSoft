import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";
import { useEditarTipoActividad } from "../../hooks/tipoActividad/useEditarTiposActividad";
import { useCrearTipoActividad } from "../../hooks/tipoActividad/useCrearTiposActividad";
import { useEliminarTipoActividad } from "../../hooks/tipoActividad/useEliminarTiposActividad";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTipoActividadModal from "./EditarTipoActividadModal";
import { CrearTipoActividadModal } from "./CrearTipoActividadModal";
import EliminarTipoActividadModal from "./EliminarTipoActividad";
import { TipoActividad } from "../../types";
import { useAuth } from "@/hooks/UseAuth"; // Asegúrate de que la ruta sea correcta
import { addToast } from "@heroui/toast";

export function TipoActividadList() {
  const { data, isLoading, error } = useGetTipoActividad();
  // No necesitamos `role` ni `user` directamente aquí, solo `hasRole` y `isLoading`
  const { hasRole, isLoading: isAuthLoading } = useAuth();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tipoActividadEditada,
    handleEditar, // Esta función abre el modal de edición
  } = useEditarTipoActividad();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear, // Esta función abre el modal de creación
  } = useCrearTipoActividad();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tipoActividadEliminada,
    handleEliminar, // Esta función abre el modal de eliminación
  } = useEliminarTipoActividad();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Verificación de permiso para el botón de crear
  const handleCrearNuevo = () => {
    if (hasRole("admin")) {
      handleCrear({ id: 0, nombre: "" }); // Abre el modal de creación
    } else {
      showAccessDenied();
    }
  };

  // Función para manejar la edición con verificación de permisos
  const handleEditarConPermiso = (item: TipoActividad) => {
    if (hasRole("admin")) {
      handleEditar(item); // Abre el modal de edición
    } else {
      showAccessDenied();
    }
  };

  // Función para manejar la eliminación con verificación de permisos
  const handleEliminarConPermiso = (item: TipoActividad) => {
    if (hasRole("admin")) {
      handleEliminar(item); // Abre el modal de eliminación
    } else {
      showAccessDenied();
    }
  };

  // Columnas de la tabla (Acciones siempre visible)
  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Acciones", uid: "acciones" }, // La columna de acciones siempre está presente
  ];

  // Render de cada celda
  const renderCell = (item: TipoActividad, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditarConPermiso(item)} // Llama a la función con verificación
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TipoActividad])}</span>;
    }
  };

  // Manejo de estados de carga
  if (isLoading || isAuthLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de actividad</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        // El botón de crear no está deshabilitado a nivel de prop, la lógica está en handleCrearNuevo
      />

      {isEditModalOpen && tipoActividadEditada && (
        <EditarTipoActividadModal
          tipoActividad={tipoActividadEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTipoActividadModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && tipoActividadEliminada && (
        <EliminarTipoActividadModal
          tipoActividad={tipoActividadEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

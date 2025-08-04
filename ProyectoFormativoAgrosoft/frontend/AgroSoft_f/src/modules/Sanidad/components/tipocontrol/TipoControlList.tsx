import { useGetTipoControl } from "../../hooks/tipoControl/useGetTipoControl";
import { useEditarTipoControl } from "../../hooks/tipoControl/useEditarTipoControl";
import { useCrearTipoControl } from "../../hooks/tipoControl/useCrearTipoControl";
import { useEliminarTipoControl } from "../../hooks/tipoControl/useEliminarTipoControl";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTipoControlModal from "./EditarTipoControlModal";
import { CrearTipoControlModal } from "./CrearTipoControlModal";
import EliminarTipoControlModal from "./EliminarTipoControlModal";
import { TipoControl } from "../../types";
import { useAuth } from "@/hooks/UseAuth"; // Importa useAuth
import { addToast } from "@heroui/toast"; // Importa addToast

export function TipoControlList() {
  const { data, isLoading, error } = useGetTipoControl();
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const userRole = user?.rol || null; // Obtiene el rol del usuario

  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tipoControlEditado,
    handleEditar,
  } = useEditarTipoControl();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearTipoControl();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tipoControlEliminado,
    handleEliminar,
  } = useEliminarTipoControl();

  const handleCrearNuevo = () => {
    const permitido = ["admin", "instructor", "pasante"].includes(
      userRole || ""
    );

    if (permitido) {
      handleCrear({ id: 0, nombre: "", descripcion: "" });
    } else {
      showAccessDenied();
    }
  };

  // Definición de columnas
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: TipoControl, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() =>
              handleActionWithPermission(
                () => handleEditar(item),
                ["admin", "instructor", "pasante"]
              )
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TipoControl])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de control</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && tipoControlEditado && (
        <EditarTipoControlModal
          tipoControl={tipoControlEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTipoControlModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && tipoControlEliminado && (
        <EliminarTipoControlModal
          tipoControl={tipoControlEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

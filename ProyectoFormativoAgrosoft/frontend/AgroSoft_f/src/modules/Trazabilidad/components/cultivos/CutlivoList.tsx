import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useEditarCultivos } from "../../hooks/cultivos/useEditarCultivos";
import { useCrearCultivos } from "../../hooks/cultivos/useCrearCultivos";
import { useEliminarCultivos } from "../../hooks/cultivos/useEliminarCultivos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCultivoModal from "./EditarCultivosModal";
import { CrearCultivoModal } from "./CrearCultivosModal";
import EliminarCultivoModal from "./EliminarCultivo";
import { Cultivo } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast"; // Importa tu utilidad de toasts
import { Chip } from "@heroui/react";

export function CultivosList() {
  const { data: cultivos, isLoading, error } = useGetCultivos();

  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    CultivosEditada,
    handleEditar,
  } = useEditarCultivos();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearCultivos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    CultivosEliminada,
    handleEliminar,
  } = useEliminarCultivos();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
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

  const handleCrearNuevo = () => {
    const permitido =
      userRole === "admin" ||
      userRole === "instructor" ||
      userRole === "pasante";

    if (permitido) {
      handleCrear({
        nombre: "",
        activo: true,
        fk_Especie: { nombre: "" },
      });
    } else {
      showAccessDenied();
    }
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Especie", uid: "especies", sortable: false },
    { name: "Estado", uid: "activo", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Cultivo, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "especies":
        return <span>{item.especies?.nombre || "Sin especie"}</span>;
      case "activo":
              return (
                <Chip
                  size="sm"
                  className="capitalize"
                  variant="dot"
                  color={item.activo ? "success" : "danger"}
                >
                  {item.activo ? "Activo" : "Inactivo"}
                </Chip>
              );
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
        return <span>{String(item[columnKey as keyof Cultivo])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los cultivos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={cultivos || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && CultivosEditada && (
        <EditarCultivoModal
          cultivo={CultivosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearCultivoModal
          onClose={closeCreateModal}
          onCreate={() => {
            // solo cerrar modal, sin notificaciones aquí
            closeCreateModal();
          }}
        />
      )}

      {isDeleteModalOpen && CultivosEliminada && (
        <EliminarCultivoModal
          cultivo={CultivosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

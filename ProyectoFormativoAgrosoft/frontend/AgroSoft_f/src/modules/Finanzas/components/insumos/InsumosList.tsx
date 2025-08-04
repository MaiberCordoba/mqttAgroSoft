import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useCrearInsumos } from "../../hooks/insumos/useCrearInsumos";
import { useEditarInsumos } from "../../hooks/insumos/useEditarInsumos";
import { useEliminarInsumos } from "../../hooks/insumos/useEliminarInsumos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { CrearInsumosModal } from "./CrearInsumosModal";
import EditarInsumosModal from "./EditarInsumosModal";
import EliminarInsumosModal from "./EliminarInsumos";
import { Insumos } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function InsumosList() {
  const { data, isLoading, error } = useGetInsumos();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearInsumos();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    insumoEditado,
    handleEditar,
  } = useEditarInsumos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    insumoEliminado,
    handleEliminar,
  } = useEliminarInsumos();

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

  // Función para crear nuevo insumo con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: null,
          nombre: "",
          fk_UnidadMedida: 0,
          descripcion: "",
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Insumos, columnKey: React.Key) => {
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
                ["admin", "instructor"]
              )
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Insumos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los insumos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isCreateModalOpen && <CrearInsumosModal onClose={closeCreateModal} />}

      {isEditModalOpen && insumoEditado && (
        <EditarInsumosModal insumo={insumoEditado} onClose={closeEditModal} />
      )}

      {isDeleteModalOpen && insumoEliminado && (
        <EliminarInsumosModal
          insumo={insumoEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

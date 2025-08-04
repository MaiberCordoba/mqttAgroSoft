import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useEditarHerramienta } from "../../hooks/herramientas/useEditarHerramientas";
import { useCrearHerramienta } from "../../hooks/herramientas/useCrearHerramientas";
import { useEliminarHerramienta } from "../../hooks/herramientas/useEliminarHerramientas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarHerramientasModal from "./EditarHerramientasModal";
import { CrearHerramientasModal } from "./CrearHerramientasModal";
import EliminarHerramientaModal from "./EliminarHerramientas";
import { Herramientas } from "../../types";
import { useGetLotes } from "@/modules/Trazabilidad/hooks/lotes/useGetLotes";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function HerramientasList() {
  const { data, isLoading, error } = useGetHerramientas();
  const { data: lotes, isLoading: loadingLotes } = useGetLotes();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    herramientaEditada,
    handleEditar,
  } = useEditarHerramienta();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearHerramienta();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    herramientaEliminada,
    handleEliminar,
  } = useEliminarHerramienta();

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

  // Función para crear nueva herramienta con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          fk_Lote: 0,
          nombre: "",
          descripcion: "",
          unidades: 0,
          valorTotal: 0,
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  // Definición de columnas
  const columnas = [
    { name: "Lote", uid: "lote" },
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Unidades", uid: "unidades" },
    { name: "Valor Herramientas", uid: "valor" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: Herramientas, columnKey: React.Key) => {
    switch (columnKey) {
      case "lote":
        const lote = lotes?.find((c) => c.id === item.fk_Lote);
        return <span>{lote ? lote.nombre : "No definido"}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "valor":
        return <span>{item.valorTotal}</span>;
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
        return <span>{String(item[columnKey as keyof Herramientas])}</span>;
    }
  };

  if (isLoading || loadingLotes) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las herramientas</p>;

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
      {isEditModalOpen && herramientaEditada && (
        <EditarHerramientasModal
          herramienta={herramientaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearHerramientasModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && herramientaEliminada && (
        <EliminarHerramientaModal
          herramienta={herramientaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

import { useGetEras } from "../../hooks/eras/useGetEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import { useEditarEras } from "../../hooks/eras/useEditarEras";
import { useCrearEras } from "../../hooks/eras/useCrearEras";
import { useEliminarEras } from "../../hooks/eras/useEliminarEras";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEraModal from "./EditarErasModal";
import { CrearEraModal } from "./CrearEraModal";
import EliminarEraModal from "./EliminarEras";
import { Eras } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast"; // Importa tu utilidad de toasts

export function EraList() {
  const { data: eras, isLoading, error } = useGetEras();
  const { data: lotes } = useGetLotes();
  
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    ErasEditada,
    handleEditar,
  } = useEditarEras();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearEras();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ErasEliminada,
    handleEliminar,
  } = useEliminarEras();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: 'Acción no permitida',
      description: 'No tienes permiso para realizar esta acción',
      color: 'danger'
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (action: () => void, requiredRoles: string[]) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const handleCrearNuevo = () => {
    const permitido = userRole === "admin" || userRole === "instructor" || userRole === "pasante";
    
    if (permitido) {
      handleCrear({
        id: 0,
        tipo: "",
        fk_lote: { nombre: "" },
        latI1: null,
        longI1: null,
        latS1: null,
        longS1: null,
        latI2: null,
        longI2: null,
        latS2: null,
        longS2: null,
      });
    } else {
      showAccessDenied();
    }
  };

  const columnas = [
    { name: "Numero #", uid: "tipo", sortable: true },
    { name: "Lote", uid: "fk_lote", sortable: true },
    { name: "Latitud Inferior Izquierda", uid: "latI1" },
    { name: "Longitud Inferior Izquierda", uid: "longI1" },
    { name: "Latitud Superior Izquierda", uid: "latS1" },
    { name: "Longitud Superior Izquierda", uid: "longS1" },
    { name: "Latitud Inferior Derecha", uid: "latI2" },
    { name: "Longitud Inferior Derecha", uid: "longI2" },
    { name: "Latitud Superior Derecha", uid: "latS2" },
    { name: "Longitud Superior Derecha", uid: "longS2" },
    { name: "Acciones", uid: "acciones" },
  ];

  const getLoteNombre = (fk_lote: any): string => {
    // Si ya viene el nombre desde el backend
    if (typeof fk_lote === "object" && fk_lote?.nombre) return fk_lote.nombre;

    // Si solo viene un ID, lo buscamos en los lotes
    if (typeof fk_lote === "number" && lotes) {
      const loteEncontrado = lotes.find((l) => l.id === fk_lote);
      return loteEncontrado?.nombre ?? "Sin asignar";
    }

    return "Sin asignar";
  };

  const renderCell = (item: Eras, columnKey: React.Key) => {
    switch (columnKey) {
      case "tipo":
        return <span>{item.tipo}</span>;
      case "fk_lote":
        return <span>{getLoteNombre(item.fk_lote)}</span>;
      case "latI1":
        return <span>{item.latI1}</span>;
      case "longI1":
        return <span>{item.longI1}</span>;
      case "latS1":
        return <span>{item.latS1}</span>;
      case "longS1":
        return <span>{item.longS1}</span>;
      case "latI2":
        return <span>{item.latI2}</span>;
      case "longI2":
        return <span>{item.longI2}</span>;
      case "latS2":
        return <span>{item.latS2}</span>;
      case "longS2":
        return <span>{item.longS2}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleActionWithPermission(
              () => handleEditar(item), 
              ["admin", "instructor", "pasante"]
            )}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Eras])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las eras</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={eras || []}
        columnas={columnas}
        claveBusqueda="tipo"
        placeholderBusqueda="Buscar por numero de era"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ErasEditada && (
        <EditarEraModal era={ErasEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearEraModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && ErasEliminada && (
        <EliminarEraModal
          era={ErasEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
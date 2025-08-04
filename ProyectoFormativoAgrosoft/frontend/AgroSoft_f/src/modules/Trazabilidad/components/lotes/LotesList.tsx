import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import { useEditarLotes } from "../../hooks/lotes/useEditarLotes";
import { useCrearLotes } from "../../hooks/lotes/useCrearLotes";
import { useEliminarLotes } from "../../hooks/lotes/useEliminarLotes";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarLoteModal from "./EditarLotesModal";
import { CrearLoteModal } from "./CrearLotesModal";
import EliminarLoteModal from "./EliminarLotes";
import { Lotes } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";
import { Chip } from "@heroui/react";

export function LoteList() {
  const { data, isLoading, error } = useGetLotes();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    LotesEditada,
    handleEditar,
  } = useEditarLotes();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearLotes();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    LotesEliminada,
    handleEliminar,
  } = useEliminarLotes();

  const showAccessDenied = () => {
    addToast({
      title: 'Acción no permitida',
      description: 'No tienes permiso para realizar esta acción',
      color: 'danger'
    });
  };

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
        estado: true,
      });
    } else {
      showAccessDenied();
    }
  };

  

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Latitud Inferior Izquierda", uid: "latI1" },
    { name: "Longitud Inferior Izquierda", uid: "longI1" },
    { name: "Latitud Superior Izquierda", uid: "latS1" },
    { name: "Longitud Superior Izquierda", uid: "longS1" },
    { name: "Latitud Inferior Derecha", uid: "latI2" },
    { name: "Longitud Inferior Derecha", uid: "longI2" },
    { name: "Latitud Superior Derecha", uid: "latS2" },
    { name: "Longitud Superior Derecha", uid: "longS2" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Lotes, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
      case "descripcion":
      case "latI1":
      case "longI1":
      case "latS1":
      case "longS1":
      case "latI2":
      case "longI2":
      case "latS2":
      case "longS2":
        return <span>{item[columnKey as keyof Lotes]}</span>;
 case "estado":
        return (
          <Chip
            size="sm"
            className="capitalize"
            variant="dot"
            color={item.estado ? "success" : "danger"}
          >
            {item.estado ? "Disponible" : "Ocupado"}
          </Chip>
        );
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
        return <span>{String(item[columnKey as keyof Lotes])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los lotes</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && LotesEditada && (
        <EditarLoteModal lote={LotesEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearLoteModal onClose={closeCreateModal} onCreate={() => {}} />
      )}

      {isDeleteModalOpen && LotesEliminada && (
        <EliminarLoteModal
          lote={LotesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

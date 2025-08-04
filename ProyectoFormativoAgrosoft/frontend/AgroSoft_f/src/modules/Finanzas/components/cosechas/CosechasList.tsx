import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useEditarCosecha } from "../../hooks/cosechas/useEditarCosechas";
import { useCrearCosecha } from "../../hooks/cosechas/useCrearCosechas";
import { useEliminarCosecha } from "../../hooks/cosechas/useEliminarCosechas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCosechasModal from "./EditarCosechasModal";
import { CrearCosechasModal } from "./CrearCosechasModal";
import EliminarCosechasModal from "./EliminarCosechas";
import { Cosechas } from "../../types";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function CosechasList() {
  const { data, isLoading, error } = useGetCosechas();
  const { data: plantacion, isLoading: loadingPlantaciones } =
    useGetPlantaciones();
  const { data: unidadesMedida, isLoading: loadingUnidadMedida } =
    useGetUnidadesMedida();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    cosechaEditada,
    handleEditar,
  } = useEditarCosecha();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearCosecha();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    cosechaEliminada,
    handleEliminar,
  } = useEliminarCosecha();

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

  // Función para crear nueva cosecha con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          fk_Plantacion: 0,
          fk_UnidadMedida: 0,
          cantidad: 0,
          fecha: "",
          precioUnidad: 0,
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  // Definición de columnas
  const columnas = [
    { name: "Cultivo", uid: "plantacion" },
    { name: "Cantidad Cosechada", uid: "cantidad" },
    { name: "Unidad Medida", uid: "unidadMedida" },
    { name: "Cantidad total (g)", uid: "totalGramos" },
    { name: "Fecha de cosecha", uid: "fecha" },
    { name: "Valor Cosecha", uid: "valorTotal" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: Cosechas, columnKey: React.Key) => {
    switch (columnKey) {
      case "plantacion":
        const plantaciones = plantacion?.find(
          (c) => c.id === item.fk_Plantacion
        );
        return (
          <span>
            {plantaciones ? plantaciones?.cultivo?.nombre : "No definido"}
          </span>
        );
      case "unidadMedida":
        const unidadMedida = unidadesMedida?.find(
          (c) => c.id === item.fk_UnidadMedida
        );
        return (
          <span>{unidadMedida ? unidadMedida.nombre : "No definido"}</span>
        );
      case "cantidad":
        return <span>{item.cantidad}</span>;
      case "totalGramos":
        return <span>{item.cantidadTotal}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "valorTotal":
        return <span>{item.valorTotal}</span>;
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
        return <span>{String(item[columnKey as keyof Cosechas])}</span>;
    }
  };

  if (isLoading || loadingPlantaciones || loadingUnidadMedida)
    return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las cosechas</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fecha"
        placeholderBusqueda="Buscar por fecha de cosecha"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && cosechaEditada && (
        <EditarCosechasModal
          cosecha={cosechaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && <CrearCosechasModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && cosechaEliminada && (
        <EliminarCosechasModal
          cosecha={cosechaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

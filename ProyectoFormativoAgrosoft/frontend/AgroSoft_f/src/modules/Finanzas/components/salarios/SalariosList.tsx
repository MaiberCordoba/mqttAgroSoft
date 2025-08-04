import { useGetSalarios } from "../../hooks/salarios/useGetSalarios";
import { useEditarSalarios } from "../../hooks/salarios/useEditarSalarios";
import { useCrearSalarios } from "../../hooks/salarios/useCrearSalarios";
import { useEliminarSalarios } from "../../hooks/salarios/useEliminarSalarios";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarSalarioModal from "./EditarSalariosModal";
import { CrearSalariosModal } from "./CrearSalariosModal";
import EliminarSalarioModal from "./EliminarSalarios";
import { Salarios } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function SalariosList() {
  const { data, isLoading, error } = useGetSalarios();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    salarioEditado,
    handleEditar,
  } = useEditarSalarios();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearSalarios();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    salarioEliminado,
    handleEliminar,
  } = useEliminarSalarios();

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

  // Función para crear nuevo salario con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          nombre: "",
          monto: 0,
          horas: 0,
          monto_minutos: 0,
          estado: "AS",
        }),
      ["admin"]
    );
  };

  // Definición de columnas
  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Monto", uid: "monto" },
    { name: "Horas", uid: "horas" },
    { name: "Monto por Minutos", uid: "monto_minutos" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Renderizado de celdas
  const renderCell = (item: Salarios, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "monto":
        return <span>${item.monto}</span>;
      case "horas":
        return <span>{item.horas}</span>;
      case "monto_minutos":
        return <span>${item.monto_minutos}</span>;
      case "estado":
        return <span>{item.estado}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() =>
              handleActionWithPermission(() => handleEditar(item), ["admin"])
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Salarios])}</span>;
    }
  };

  if (isLoading) return <p>Cargando salarios...</p>;
  if (error) return <p>Error al cargar los salarios</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && salarioEditado && (
        <EditarSalarioModal salario={salarioEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearSalariosModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && salarioEliminado && (
        <EliminarSalarioModal
          salario={salarioEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

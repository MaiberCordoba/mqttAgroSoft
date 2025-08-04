import { useGetUsosHerramientas } from "../../hooks/usosHerramientas/useGetUsosHerramientas";
import { useEditarUsoHerramienta } from "../../hooks/usosHerramientas/useEditarUsosHerramientas";
import { useCrearUsosHerramienta } from "../../hooks/usosHerramientas/useCrearUsosHerramientas";
import { useEliminarUsoHerramienta } from "../../hooks/usosHerramientas/useEliminarUsosHerramientas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUsosHerramientasModal from "./EditarUsosHerramientasModal";
import { CrearUsoHerramientaModal } from "./CrearUsosHerramientasModal";
import EliminarUsosHerramientasModal from "./EliminarUsosHerramientas";
import { UsosHerramientas } from "../../types";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/hooks/UseAuth";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";

export function UsosHerramientasList() {
  const { user } = useAuth();
  const userRole = user?.rol || null;
  const { data, isLoading, error } = useGetUsosHerramientas();
  const { data : herramientas, isLoading : loadingHerramientas } = useGetHerramientas();
  const { data : actividades, isLoading : loadingActividades } = useGetActividades();
  const { data : controles, isLoading : loadingControles } = useGetControles();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    usoHerramientaEdidata, 
    handleEditar 
  } = useEditarUsoHerramienta();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosHerramienta();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoHerramientaEliminada,
    handleEliminar,
  } = useEliminarUsoHerramienta();

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
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          fk_Herramienta: 0,
          fk_Actividad: 0,
          fk_Control:0,
          unidades: 0,
        }),
      ["admin", "instructor", "pasante"]
    );

  };

  // Definición de columnas
  const columnas = [
    { name: "Herramienta", uid: "herramienta" },
    { name: "Actividad", uid: "actividad" },
    { name: "Control", uid: "control" },
    { name: "Unidades", uid: "unidades"},
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: UsosHerramientas, columnKey: React.Key) => {
    switch (columnKey) {
      case "herramienta":
        const herramienta = herramientas?.find(
          (c) => c.id === item.fk_Herramienta
        );
        return <span>{herramienta ? herramienta.nombre : "No definido"}</span>;
      case "actividad":
        const actividad = actividades?.find((c) => c.id === item.fk_Actividad);
        return <span>{actividad ? actividad.titulo : "No aplica"}</span>;
      case "control":
        const control = controles?.find((c) => c.id === item.fk_Control);
        return <span>{control ? control?.descripcion : "No aplica"}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() =>
              handleActionWithPermission(
                () => handleEditar(item),
                ["admin", "instructor"]
              )
            }
            onEliminar={() =>
              handleActionWithPermission(
                () => handleEliminar(item),
                ["admin", "instructor"]
              )
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UsosHerramientas])}</span>;
    }
  };

  if (isLoading || loadingHerramientas || loadingActividades || loadingControles) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Usos de Herramientas</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="herramienta"
        placeholderBusqueda="Buscar por herramienta"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && usoHerramientaEdidata && (
        <EditarUsosHerramientasModal
          usoHerramienta={usoHerramientaEdidata}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsoHerramientaModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && usoHerramientaEliminada && (
        <EliminarUsosHerramientasModal
          usoHerramienta={usoHerramientaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

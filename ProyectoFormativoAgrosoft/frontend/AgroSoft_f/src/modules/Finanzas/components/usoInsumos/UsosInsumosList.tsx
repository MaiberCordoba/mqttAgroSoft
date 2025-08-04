import { useGetUsosInsumos } from "../../hooks/usoInsumos/useGetUsoInsumos";
import { useEditarUsoInsumo } from "../../hooks/usoInsumos/useEditarUsoInsumos";
import { useCrearUsosInsumo } from "../../hooks/usoInsumos/useCrearUsoInsumos";
import { useEliminarUsoInsumo } from "../../hooks/usoInsumos/useEliminarUsoInsumos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUsosInsumosModal from "./EditarUsosInsumosModal";
import { CrearUsoInsumoModal } from "./CrearUsosInsumosModal";
import EliminarUsosInsumosModal from "./EliminarUsosInsumos";
import { UsosInsumos } from "../../types";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function UsosInsumosList() {
  const { data, isLoading, error, refetch } = useGetUsosInsumos();
  const { data: insumos, isLoading: loadingInsumos } = useGetInsumos();
  const { data: actividades, isLoading: loadingActividades } =
    useGetActividades();
  const { data: controles, isLoading: loadingControles } = useGetControles();
  const { data: unidades, isLoading: loadingUnidades } = useGetUnidadesMedida();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    usoInsumoEdidato,
    handleEditar,
  } = useEditarUsoInsumo();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosInsumo();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoInsumoEliminado,
    handleEliminar,
  } = useEliminarUsoInsumo();

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
          fk_Insumo: 0,
          fk_Actividad: 0,
          fk_Control: 0,
          fk_UnidadMedida: 0,
          cantidadProducto: 0,
          costoUsoInsumo: 0,
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  const columnas = [
    { name: "Insumo", uid: "insumo" },
    { name: "Actividad", uid: "actividad" },
    { name: "Control", uid: "control" },
    { name: "Cantidad Usado", uid: "cantidad" },
    { name: "Unidad Medida", uid: "unidad" },
    { name: "Costo producto usado", uid: "costo" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: UsosInsumos, columnKey: React.Key) => {
    switch (columnKey) {
      case "insumo":
        const insumo = insumos?.find((i) => i.id === item.fk_Insumo);
        return <span>{insumo ? insumo.nombre : "No definido"}</span>;
      case "actividad":
        const actividad = actividades?.find((a) => a.id === item.fk_Actividad);
        return <span>{actividad ? actividad.titulo : "No aplica"}</span>;
      case "control":
        const control = controles?.find((a) => a.id === item.fk_Control);
        return <span>{control ? control.descripcion : "No aplica"}</span>;
      case "unidad":
        const unidad = unidades?.find((a) => a.id === item.fk_UnidadMedida);
        return <span>{unidad ? unidad.nombre : "No definido"}</span>;
      case "cantidad":
        return <span>{item.cantidadProducto}</span>;
      case "costo":
        return <span>{item.costoUsoInsumo}</span>;
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
        return <span>{String(item[columnKey as keyof UsosInsumos])}</span>;
    }
  };

  if (
    isLoading ||
    loadingInsumos ||
    loadingActividades ||
    loadingControles ||
    loadingUnidades
  )
    return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Usos de Insumos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="insumo"
        placeholderBusqueda="Buscar por insumo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && usoInsumoEdidato && (
        <EditarUsosInsumosModal
          usoInsumo={usoInsumoEdidato}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsoInsumoModal
          onClose={closeCreateModal}
          onCreate={() => {
            refetch(); // Vuelve a cargar la tabla tras crear
            closeCreateModal();
          }}
        />
      )}

      {isDeleteModalOpen && usoInsumoEliminado && (
        <EliminarUsosInsumosModal
          usoInsumo={usoInsumoEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

import { useGetVentas } from "../../hooks/ventas/useGetVentas";
import { useEditarVenta } from "../../hooks/ventas/useEditarVentas";
import { useCrearVenta } from "../../hooks/ventas/useCrearVentas";
import { useEliminarVenta } from "../../hooks/ventas/useEliminarVentas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarVentasModal from "./EditarVentasModal";
import { CrearVentasModal } from "./CrearVentasModal";
import EliminarVentaModal from "./EliminarVentas";
import { Ventas } from "../../types";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function VentasList() {
  const { user } = useAuth();
  const userRole = user?.rol || null;
  const { data, isLoading, error } = useGetVentas();

  const { data: cosechas, isLoading: loadingCosechas } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } =
    useGetUnidadesMedida();
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    ventaEditada,
    handleEditar,
  } = useEditarVenta();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearVenta();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ventaEliminada,
  } = useEliminarVenta();

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

  // Función para crear nueva venta con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          fk_Cosecha: 0,
          fecha: "",
          fk_UnidadMedida: 0,
          cantidad: 0,
          valorTotal: 0,
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  const columnas = [
    { name: "Fecha Venta", uid: "fecha" },
    { name: "Producto", uid: "cosecha" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Unidad de medida", uid: "unidadMedida" },
    { name: "Valor Total de venta", uid: "valorTotal" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Ventas, columnKey: React.Key) => {
    switch (columnKey) {
      case "cosecha":
        const cosecha = cosechas?.find((c) => c.id === item.fk_Cosecha);
        const plantacion = plantaciones?.find(
          (p) => p.id === cosecha?.fk_Plantacion
        );
        const producto = plantacion?.cultivo?.nombre || "Producto no definido";
        return <span>{producto}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "unidadMedida":
        const unidadMedida = unidadesMedida?.find(
          (c) => c.id === item.fk_UnidadMedida
        );
        return (
          <span>{unidadMedida ? unidadMedida.nombre : "No definido"}</span>
        );
      case "cantidad":
        return <span>{item.cantidad}</span>;
      case "valorTotal":
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
        return <span>{String(item[columnKey as keyof Ventas])}</span>;
    }
  };

  if (isLoading || loadingCosechas || loadingUnidadesMedida)
    return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las ventas</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fecha"
        placeholderBusqueda="Buscar por fecha de venta"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ventaEditada && (
        <EditarVentasModal venta={ventaEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearVentasModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && ventaEliminada && (
        <EliminarVentaModal
          venta={ventaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

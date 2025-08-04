import { useGetSensor } from "../../hooks/sensor/useGetSensor";
import { useEditarSensor } from "../../hooks/sensor/useEditarSensor";
import { useCrearSensor } from "../../hooks/sensor/useCrearSensor";
import { useEliminarSensor } from "../../hooks/sensor/useEliminarSenosr";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarSensorModal from "./EditarSensorModal";
import CrearSensorModal from "./CrearSensorModal";
import EliminarSensorModal from "./EliminarSensorModal";
import { SensorData, SENSOR_TYPES } from "../../types/sensorTypes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function SensorLista() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const { data, isLoading, error } = useGetSensor();
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    sensorEditado,
    handleEditar,
  } = useEditarSensor();
  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearSensor();
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    sensorEliminado,
  } = useEliminarSensor();

  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "Solo los administradores pueden realizar esta acción",
      color: "danger",
    });
  };

  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[] = ["admin"] // Solo admin por defecto
  ) => {
    if (userRole && requiredRoles.includes(userRole)) {
      action();
    } else {
      showAccessDenied();
    }
  };

  // Función para crear nuevo sensor con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(() =>
      handleCrear({
        id: 0,
        fk_lote: null,
        fk_eras: null,
        fecha: "",
        tipo: "TEM",
        valor: 0,
        umbral_minimo: null,
        umbral_maximo: null,
      })
    );
  };

  const irADetalleSensor = (id: number) => {
    navigate(`/sensores/${id}`);
  };

  const getSensorLabel = (tipo: string) => {
    const sensor = SENSOR_TYPES.find((s) => s.key === tipo);
    return sensor ? sensor.label : "Desconocido";
  };

  const columnas = [
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Tipo de Sensor", uid: "tipo" },
    { name: "Valor", uid: "valor" },
    { name: "Umbral Mínimo", uid: "umbral_minimo" },
    { name: "Umbral Máximo", uid: "umbral_maximo" },
    { name: "Ubicación", uid: "ubicacion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: SensorData, columnKey: React.Key) => {
    switch (columnKey) {
      case "fecha":
        return (
          <span
            onClick={() => irADetalleSensor(item.id)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {new Date(item.fecha).toLocaleString()}
          </span>
        );
      case "tipo":
        return (
          <span
            onClick={() => irADetalleSensor(item.id)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {getSensorLabel(item.tipo)}
          </span>
        );
      case "valor":
        return (
          <span
            onClick={() => irADetalleSensor(item.id)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {item.valor}
          </span>
        );
      case "umbral_minimo":
        return <span>{item.umbral_minimo ?? "—"}</span>;
      case "umbral_maximo":
        return <span>{item.umbral_maximo ?? "—"}</span>;
      case "ubicacion":
        if (item.fk_lote !== null && item.fk_lote !== undefined) {
          return (
            <span className="text-green-600 font-medium">
              Lote {item.fk_lote}
            </span>
          );
        } else if (item.fk_eras !== null && item.fk_eras !== undefined) {
          return (
            <span className="text-blue-600 font-medium">
              Era {item.fk_eras}
            </span>
          );
        } else {
          return <span className="text-gray-400 italic">No asignado</span>;
        }
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() =>
              handleActionWithPermission(() => handleEditar(item))
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof SensorData])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los sensores</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="tipo"
        placeholderBusqueda="Buscar por tipo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && sensorEditado && (
        <EditarSensorModal sensor={sensorEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearSensorModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && sensorEliminado && (
        <EliminarSensorModal
          sensor={sensorEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

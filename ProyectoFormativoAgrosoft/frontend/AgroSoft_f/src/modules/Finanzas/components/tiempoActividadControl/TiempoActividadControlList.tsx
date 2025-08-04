import { useGetTiempoActividadControl } from "../../hooks/tiempoActividadControl/useGetTiempoActividadDesecho";
import { useEditarTiempoActividadControl } from "../../hooks/tiempoActividadControl/useEditarTiempoActividadDesecho";
import { useCrearTiempoActividadControl } from "../../hooks/tiempoActividadControl/useCrearTiempoActividadDesecho";
import { useEliminarTiempoActividadControl } from "../../hooks/tiempoActividadControl/useEliminarTiempoActividadDesecho";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTiempoActividadControlModal from "./EditarTiempoActividadControlModal";
import { CrearTiempoActividadControlModal } from "./CrearTiempoActividadControlModal";
import EliminarTiempoActividadControlModal from "./EliminarTiempoActividadControl";
import { TiempoActividadControl } from "../../types";
import { useGetActividades } from "@/modules/Finanzas/hooks/actividades/useGetActividades";
import { useGetControles } from "@/modules/Sanidad/hooks/controles/useGetControless";
import { useGetSalarios } from "@/modules/Finanzas/hooks/salarios/useGetSalarios";
import { useGetUnidadesTiempo } from "@/modules/Finanzas/hooks/unidadesTiempo/useGetUnidadesTiempo";

export function TiempoActividadControlList() {
  const { data, isLoading, error } = useGetTiempoActividadControl();
  const { data: actividades } = useGetActividades();
  const { data: controles } = useGetControles();
  const { data: salarios } = useGetSalarios();
  const { data: unidadesTiempo } = useGetUnidadesTiempo();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tiempoActividadControlEditada,
    handleEditar
  } = useEditarTiempoActividadControl();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear
  } = useCrearTiempoActividadControl();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tiempoActividadControlEliminada,
    handleEliminar
  } = useEliminarTiempoActividadControl();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      tiempo: 0,
      valorTotal: 0,
      fk_unidadTiempo: 0,
      fk_actividad: 0,
      fk_control: 0,
      fk_salario: 0
    });
  };

  const columnas = [
    { name: "Actividad", uid: "actividad" },
    { name: "Fecha Finalizacion", uid: "fecha" },
    { name: "Control", uid: "control" },
    { name: "Salario", uid: "salario" },
    { name: "Tiempo", uid: "tiempo" },
    { name: "Unidad Tiempo", uid: "unidadTiempo" },
    { name: "Valor actividad", uid: "valorTotal" },
    { name: "Acciones", uid: "acciones" }
  ];

  const renderCell = (item: TiempoActividadControl, columnKey: React.Key) => {
    switch (columnKey) {
      case "actividad":
        const actividad = actividades?.find((a) => a.id === item.fk_actividad);
        return <span>{actividad ? actividad.titulo : "No Aplica"}</span>;
      case "control":
        const control = controles?.find((c) => c.id === item.fk_control);
        return <span>{control ? control.descripcion : "No Aplica"}</span>;
      case "salario":
        const salario = salarios?.find((s) => s.id === item.fk_salario);
        return <span>{salario ? salario.nombre : "No definido"}</span>;
      case "unidadTiempo":
        const unidad = unidadesTiempo?.find((u) => u.id === item.fk_unidadTiempo);
        return <span>{unidad ? unidad.nombre : "No definido"}</span>;
      case "tiempo":
        return <span>{item.tiempo}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "valorTotal":
        return <span>${item.valorTotal}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TiempoActividadControl])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="tiempo"
        placeholderBusqueda="Buscar por tiempo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && tiempoActividadControlEditada && (
        <EditarTiempoActividadControlModal
          tiempoActividadControl={tiempoActividadControlEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTiempoActividadControlModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && tiempoActividadControlEliminada && (
        <EliminarTiempoActividadControlModal
          tiempoActividadControl={tiempoActividadControlEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

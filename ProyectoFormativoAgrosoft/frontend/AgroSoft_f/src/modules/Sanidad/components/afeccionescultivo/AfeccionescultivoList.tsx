import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useEditarAfeccionCultivo } from "../../hooks/afeccionescultivo/useEditarAfeccionescultivo";
import { useCrearAfeccionCultivo } from "../../hooks/afeccionescultivo/useCrearAfeccionescultivo";
import { useEliminarAfeccionCultivo } from "../../hooks/afeccionescultivo/useEliminarAfeccionescultivo";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarAfeccionCultivoModal from "./EditarAfeccionescultivoModal";
import { CrearAfeccionCultivoModal } from "./CrearAfeccionescultivoModal";
import EliminarAfeccionCultivoModal from "./EliminarAfeccionescultivo";
import { AfeccionesCultivo, EstadoAfeccion } from "../../types";
import { useAuth } from "@/hooks/UseAuth"; // Importa useAuth
import { addToast } from "@heroui/toast"; // Importa addToast

export function AfeccionesCultivoList() {
  const { data, isLoading, error } = useGetAfeccionesCultivo();
  const { data: afecciones } = useGetAfecciones();
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const userRole = user?.rol || null; // Obtiene el rol del usuario

  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

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

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    afeccionCultivoEditada,
    handleEditar,
  } = useEditarAfeccionCultivo();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearAfeccionCultivo();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    afeccionCultivoEliminada,
    handleEliminar,
  } = useEliminarAfeccionCultivo();

  const handleCrearNuevo = () => {
    const permitido = ["admin", "instructor", "pasante"].includes(
      userRole || ""
    );

    if (permitido) {
      handleCrear({
        fk_Plantacion: 0,
        fk_Plaga: 0,
        fechaEncuentro: "",
        estado: "ST",
      });
    } else {
      showAccessDenied();
    }
  };

  const columnas = [
    { name: "Cultivo", uid: "cultivo", sortable: true },
    { name: "Especie", uid: "especie" },
    { name: "Era", uid: "era" },
    { name: "Lote", uid: "lote" },
    { name: "Plaga", uid: "plaga" },
    { name: "Tipo Plaga", uid: "tipoPlaga" },
    { name: "Fecha Detección", uid: "fechaEncuentro" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: AfeccionesCultivo, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        return (
          <span>{item.plantaciones?.cultivo?.nombre || "No definido"}</span>
        );
      case "especie":
        return (
          <span>
            {item.plantaciones?.cultivo?.especies?.nombre || "No definido"}
          </span>
        );
      case "era":
        return <span>{item.plantaciones?.eras?.tipo || "No definido"}</span>;
      case "lote":
        return (
          <span>{item.plantaciones?.eras?.Lote?.nombre || "No definido"}</span>
        );
      case "plaga":
        return <span>{item.plagas?.nombre || "No definido"}</span>;
      case "tipoPlaga":
        return <span>{item.plagas?.tipoPlaga?.nombre || "No definido"}</span>;
      case "fechaEncuentro":
        return <span>{item.fechaEncuentro}</span>;
      case "estado":
        return (
          <span>
            {item.estado ? EstadoAfeccion[item.estado] : "No definido"}
          </span>
        );
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
        return (
          <span>{String(item[columnKey as keyof AfeccionesCultivo])}</span>
        );
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones cultivo</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fk_Plaga"
        placeholderBusqueda="Buscar por plaga"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && afeccionCultivoEditada && (
        <EditarAfeccionCultivoModal
          afeccionCultivo={afeccionCultivoEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearAfeccionCultivoModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && afeccionCultivoEliminada && (
        <EliminarAfeccionCultivoModal
          afeccioncultivo={afeccionCultivoEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

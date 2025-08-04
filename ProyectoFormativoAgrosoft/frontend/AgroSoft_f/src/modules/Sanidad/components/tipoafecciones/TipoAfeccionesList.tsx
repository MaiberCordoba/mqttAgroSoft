import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";
import { useEditarTipoAfeccion } from "../../hooks/tiposAfecciones/useEditarTipoAfeccion";
import { useCrearTipoAfeccion } from "../../hooks/tiposAfecciones/useCrearTipoAfeccion";
import { useEliminarTipoAfeccion } from "../../hooks/tiposAfecciones/useEliminarTipoAfeccion";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTipoAfeccionModal from "./EditarTipoAfeccionModal";
import { CrearTipoAfeccionModal } from "./CrearTipoAfeccionModal";
import EliminarTipoAfeccionModal from "./EliminarTipoAfeccionModal";
import { TiposAfecciones } from "../../types";
import { Image } from "@heroui/react";
import { useAuth } from "@/hooks/UseAuth"; // Importa useAuth
import { addToast } from "@heroui/toast"; // Importa addToast

export function TipoAfeccionesList() {
  const { data, isLoading, error } = useGetTipoAfecciones();
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
    tipoafeccionEditada,
    handleEditar,
  } = useEditarTipoAfeccion();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearTipoAfeccion();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tipoafeccionEliminada,
    handleEliminar,
  } = useEliminarTipoAfeccion();

  const handleCrearNuevo = () => {
    const permitido = ["admin", "instructor", "pasante"].includes(
      userRole || ""
    );

    if (permitido) {
      handleCrear({ id: 0, nombre: "", descripcion: "", img: "" });
    } else {
      showAccessDenied();
    }
  };

  // Definición de columnas
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Img", uid: "img" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: TiposAfecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "img":
        return (
          <Image
            isZoomed
            src={item.img}
            alt={item.nombre}
            className="w-14 h-14 object-contain rounded-lg"
          />
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
        return <span>{String(item[columnKey as keyof TiposAfecciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de afección</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && tipoafeccionEditada && (
        <EditarTipoAfeccionModal
          tipoAfeccion={tipoafeccionEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTipoAfeccionModal
          onClose={closeCreateModal}
          onCreate={handleCrearNuevo}
        />
      )}

      {isDeleteModalOpen && tipoafeccionEliminada && (
        <EliminarTipoAfeccionModal
          tipoAfeccion={tipoafeccionEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

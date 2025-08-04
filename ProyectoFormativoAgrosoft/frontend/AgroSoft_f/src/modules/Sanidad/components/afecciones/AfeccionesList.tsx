import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { useEditarAfeccion } from "../../hooks/afecciones/useEditarAfeccion";
import { useCrearAfeccion } from "../../hooks/afecciones/useCrearAfeccion";
import { useEliminarAfeccion } from "../../hooks/afecciones/useEliminarAfeccion";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarAfeccionModal from "./EditarAfeccionModal";
import { CrearAfeccionModal } from "./CrearAfeccionModal";
import EliminarAfeccionModal from "./EliminarAfeccion";
import { Afecciones } from "../../types";
import { useEffect } from "react";
import { Image } from "@heroui/react";
import { useAuth } from "@/hooks/UseAuth"; // Importa useAuth
import { addToast } from "@heroui/toast"; // Importa addToast

export function AfeccionesList() {
  const { data, isLoading, error } = useGetAfecciones();
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const userRole = user?.rol || null; // Obtiene el rol del usuario

  useEffect(() => {
    console.log(data);
  }, [data]);

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
    afeccionEditada,
    handleEditar,
  } = useEditarAfeccion();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearAfeccion();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    afeccionEliminada,
    handleEliminar,
  } = useEliminarAfeccion();

  const handleCrearNuevo = () => {
    const permitido = ["admin", "instructor", "pasante"].includes(
      userRole || ""
    );

    if (permitido) {
      handleCrear({ id: 0, nombre: "", descripcion: "", fk_Tipo: 0, img: "" });
    } else {
      showAccessDenied();
    }
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tipo afectación", uid: "tipoPlaga" },
    { name: "Img", uid: "img" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Afecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tipoPlaga":
        return <span>{item.tipoPlaga?.nombre || "No definido"}</span>;
      case "img":
        return (
          <Image
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
        return <span>{String(item[columnKey as keyof Afecciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && afeccionEditada && (
        <EditarAfeccionModal
          afeccion={afeccionEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && <CrearAfeccionModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && afeccionEliminada && (
        <EliminarAfeccionModal
          afeccion={afeccionEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}

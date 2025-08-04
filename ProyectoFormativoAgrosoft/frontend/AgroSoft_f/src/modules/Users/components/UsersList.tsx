import { useEffect, useState } from "react";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { useGetUsers } from "../hooks/useGetUsers";
import { useEditarUsers } from "../hooks/useEditarUsers";
import { useCrearUsers } from "../hooks/useCrearUsers";
import { useEliminarUsers } from "../hooks/useEliminarUsers";
import { useReporteUsuarios } from "../hooks/useReporteUsuarios";
import { User } from "../types";
import EditarUserModal from "./EditarUsersModal";
import EliminarUserModal from "./EliminarUsersModal";
import { Chip } from "@heroui/react";
import { CrearUsersModal } from "./CrearUsersModal";
import RegistroMasivoModal from "./registroMasivoModal";

import { PDFViewer } from "@react-pdf/renderer";
import { ReportePdfUsuarios } from "./ReportePdfUsuarios";
import { Download, X } from "lucide-react";

export function UsersList() {
  const { data, isLoading, error } = useGetUsers();
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    UsersEditada,
    handleEditar,
  } = useEditarUsers();
  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsers();
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    UsersEliminada,
    handleEliminar,
  } = useEliminarUsers();

  const [isRegistroMasivoOpen, setIsRegistroMasivoOpen] = useState(false);

  const {
    data: reporteData,
    isLoading: loadingReporte,
    isError: errorReporte,
  } = useReporteUsuarios();

  // Estado para controlar si mostramos la previsualización del PDF
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log("reporteData en UsersList:", reporteData);
  }, [reporteData]);

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      identificacion: 0,
      nombre: "",
      apellidos: "",
      telefono: "",
      correoElectronico: "",
      admin: false,
      estado: "",
      rol: "",
    });
  };

  const columnas = [
    { name: "Identificacion", uid: "identificacion", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Apellidos", uid: "apellidos" },
    { name: "Email", uid: "correoElectronico" },
    { name: "Rol", uid: "rol" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: User, columnKey: React.Key) => {
    switch (columnKey) {
      case "identificacion":
        return <span>{item.identificacion}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "apellidos":
        return <span>{item.apellidos}</span>;
      case "correoElectronico":
        return <span>{item.correoElectronico}</span>;
      case "rol":
        return <span>{item.rol}</span>;
      case "estado":
        return (
          <Chip
            size="sm"
            className="capitalize"
            variant="dot"
            color={item.estado === "activo" ? "success" : "danger"}
          >
            {item.estado}
          </Chip>
        );
      case "acciones":
        return <AccionesTabla onEditar={() => handleEditar(item)} />;
      default:
        return <span>{String(item[columnKey as keyof User])}</span>;
    }
  };

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre o email"
        onRegistroMasivo={() => setIsRegistroMasivoOpen(true)}
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        opcionesEstado={[
          { uid: "activo", nombre: "Activo" },
          { uid: "inactivo", nombre: "Inactivo" },
        ]}
        renderReporteAction={() => {
          if (loadingReporte) {
            return (
              <button
                className="p-2 rounded-full bg-gray-100 cursor-not-allowed"
                title="Cargando reporte…"
                disabled
              >
                <Download className="h-4 w-4 animate-spin text-blue-500" />
              </button>
            );
          }
          if (errorReporte || !reporteData) {
            return (
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Error al cargar reporte"
                disabled
              >
                <Download className="h-5 w-5 text-gray-400" />
              </button>
            );
          }
          return (
            <>
              {/* Botón con icono de descarga que abre la previsualización */}
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Mostrar previsualización y descargar"
              >
                <Download className="h-5 w-5 text-red-600" />
              </button>
            </>
          );
        }}
      />

      {/* Mostrar previsualización solo cuando showPreview sea true */}
      {showPreview && (
        <div className="border rounded mt-4 relative">
          <h2 className="text-sm font-semibold px-2 py-1 bg-gray-100 flex justify-between items-center">
            Vista previa del PDF
            <button
              onClick={() => setShowPreview(false)}
              className="text-red-500 font-bold px-2 hover:text-red-700"
              title="Cerrar previsualización"
            >
              <X />
            </button>
          </h2>
          <PDFViewer width="100%" height={600}>
            <ReportePdfUsuarios data={reporteData || []} />
          </PDFViewer>
        </div>
      )}

      {/* Modales */}
      {isEditModalOpen && UsersEditada && (
        <EditarUserModal user={UsersEditada} onClose={closeEditModal} />
      )}
      {isCreateModalOpen && <CrearUsersModal onClose={closeCreateModal} />}
      {isDeleteModalOpen && UsersEliminada && (
        <EliminarUserModal
          user={UsersEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}

      <RegistroMasivoModal
        isOpen={isRegistroMasivoOpen}
        onClose={() => setIsRegistroMasivoOpen(false)}
      />
    </div>
  );
}

import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import TableComponent from "@/components/Table";
import ModalComponent from "@/components/Modal";
import UserEditModal from "../components/UserEditModal"; // Importamos el modal de edición
import { User } from "@/modules/Users/types";
import { Button } from "@heroui/react";

export function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Estado para el modal de edición

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;
  if (!users || users.length === 0) return <p>No se encontraron usuarios.</p>;

  // Definir columnas de la tabla
  const userColumns: { key: keyof User | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "identificacion", label: "Identificación" },
    { key: "nombre", label: "Nombre" },
    { key: "apellidos", label: "Apellidos" },
    { key: "telefono", label: "Teléfono" },
    { key: "correoElectronico", label: "Correo Electrónico" },
    { key: "admin", label: "Admin" },
    { key: "acciones", label: "Acciones" }, // Columna para botones de acciones
  ];

  // Función para abrir el modal de detalles
  const handleDetailsClick = (user: User) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  // Función para abrir el modal de edición
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Usuarios</h1>

      {/* Tabla de usuarios */}
      <TableComponent<User>
        columns={userColumns}
        data={users}
        renderActions={(user) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(user)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(user)}>
              Editar
            </Button>
          </div>
        )}
      />

      {/* Modal para ver detalles del usuario */}
      <ModalComponent
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Detalles del Usuario"
        footerButtons={[{ label: "Cerrar", color: "danger", onClick: () => setDetailsModalOpen(false) }]}
      >
        {selectedUser && (
          <div>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Identificación:</strong> {selectedUser.identificacion}</p>
            <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellidos}</p>
            <p><strong>Teléfono:</strong> {selectedUser.telefono}</p>
            <p><strong>Correo Electrónico:</strong> {selectedUser.correoElectronico}</p>
            <p><strong>Admin:</strong> {selectedUser.admin ? "Sí" : "No"}</p>
          </div>
        )}
      </ModalComponent>

      {/* Modal para editar usuario */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

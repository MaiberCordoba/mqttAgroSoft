import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query"; // ✅ Importar QueryClient
import FormModal from "@/components/FormModal";
import { User } from "@/modules/Users/types";
import { updateUser } from "../api/usersApi";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null; // Si no hay usuario, no renderiza nada

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient(); //  Obtener QueryClient

  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    try {
      await updateUser(user.id, formData);
      queryClient.invalidateQueries({ queryKey: ["users"] }); //  Refrescar lista de usuarios
      onClose(); // Cierra el modal después de actualizar
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
    setLoading(false);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Editar Usuario"
      fields={[
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "apellidos", label: "Apellidos", type: "text" },
        { name: "identificacion", label: "Identificación", type: "text" },
        { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date" },
        { name: "telefono", label: "Teléfono", type: "text" },
        { name: "correoElectronico", label: "Correo Electrónico", type: "email" },
        {
          name: "admin",
          label: "¿Es Administrador?",
          type: "select",
          options: [
            { label: "Sí", value: "true" },
            { label: "No", value: "false" },
          ],
        },
      ]}
      initialValues={user}
    />
  );
};

export default UserEditModal;

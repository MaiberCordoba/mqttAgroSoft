import FormModal from "@/components/FormModal";

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserRegisterModal: React.FC<UserRegisterModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Datos del usuario a registrar:", formData);
    // Aquí iría la lógica de registro de usuario con un API
    console.log("UserRegisterModal se está renderizando. isOpen:", isOpen);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Registrar Usuario"
      fields={[
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "apellidos", label: "Apellidos", type: "text" },
        { name: "identificacion", label: "Identificación", type: "text" },
        { name: "fechaNacimiento", label: "Fecha Nacimiento", type: "date" },
        { name: "telefono", label: "Teléfono", type: "text" },
        { name: "correoElectronico", label: "Correo Electrónico", type: "email" },
        { name: "password", label: "Contraseña", type: "password" },
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
    />
  );
};

export default UserRegisterModal;

import React, { useState, useEffect } from "react";
import { User } from "@/modules/Users/types";
import { Input, Button } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useAuth } from "@/hooks/UseAuth";
import { usePatchUsers } from "../hooks/usePatchUsers";
import { useGetUsers } from "../hooks/useGetUsers";
import { addToast } from "@heroui/react";

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { user: authUser, updateUser: updateAuthUser } = useAuth();
  const { data: users, refetch: refetchUsers } = useGetUsers();
  const { mutate: updateUser, isPending } = usePatchUsers();
  
  // Encontrar el usuario actual en la lista de usuarios
  const currentUser = users?.find(u => u.id === authUser?.id) || authUser;
  
  const [userData, setUserData] = useState({
    nombre: "",
    apellidos: "",
    correoElectronico: "",
    identificacion: "",
    telefono: "",
    password: "",
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setUserData({
        nombre: currentUser.nombre || "",
        apellidos: currentUser.apellidos || "",
        correoElectronico: currentUser.correoElectronico || "",
        identificacion: currentUser.identificacion?.toString() || "",
        telefono: currentUser.telefono || "",
        password: currentUser.password || ""
      });
    }
  }, [currentUser, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof userData
  ) => {
    setUserData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

 const handleSubmit = () => {
  if (!currentUser?.id) {
    addToast({
      title: "Error",
      description: "No se pudo identificar al usuario",
      color: "danger",
    });
    return;
  }

  const changedData: Partial<User> = {};
  
  // Campos normales (excluyendo password)
  Object.keys(userData).forEach(key => {
    if (key === "password") return; // Saltamos password aquí
    
    const userKey = key as keyof User;
    const currentValue = userData[key as keyof typeof userData];
    const originalValue = currentUser[userKey]?.toString() || "";
    
    if (currentValue !== originalValue) {
      changedData[userKey] = userKey === 'identificacion' 
        ? Number(currentValue)
        : currentValue;
    }
  });
  
  // Manejo especial para password: solo si no está vacío y es diferente
  if (
    userData.password !== "" && 
    userData.password !== currentUser.password
  ) {
    changedData.password = userData.password;
  }

    if (Object.keys(changedData).length === 0) {
      addToast({
        title: "Sin cambios",
        description: "No se detectaron cambios para guardar",
        color: "default",
      });
      onClose();
      return;
    }

    updateUser(
      { id: currentUser.id, data: changedData },
      {
        onSuccess: (updatedUser) => {
          // Actualizar tanto el contexto como los datos de TanStack Query
          updateAuthUser(updatedUser);
          refetchUsers();
          
          addToast({
            title: "¡Perfil actualizado!",
            description: "Tus cambios se guardaron correctamente",
            color: "success",
          });
          onClose();
        }
      }
    );
  };

  if (!currentUser) return null;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Mi Perfil"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar Cambios",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Identificación"
          type="text"
          value={userData.identificacion}
          onChange={(e) => handleInputChange(e, "identificacion")}
          required
        />

        <Input
          label="Nombre"
          type="text"
          value={userData.nombre}
          onChange={(e) => handleInputChange(e, "nombre")}
          required
        />

        <Input
          label="Apellidos"
          type="text"
          value={userData.apellidos}
          onChange={(e) => handleInputChange(e, "apellidos")}
          required
        />

        <Input
          label="Correo Electrónico"
          type="email"
          value={userData.correoElectronico}
          onChange={(e) => handleInputChange(e, "correoElectronico")}
          required
        />

        <Input
          label="Contraseña"
          type="text"
          value={userData.password}
          onChange={(e) => handleInputChange(e, "password")}
          required
        />

        <Input
          label="Teléfono"
          type="tel"
          value={userData.telefono}
          onChange={(e) => handleInputChange(e, "telefono")}
        />
      </div>
    </ModalComponent>
  );
};

export default EditarPerfilModal;
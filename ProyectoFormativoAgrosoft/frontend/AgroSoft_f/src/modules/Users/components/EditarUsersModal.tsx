import React, { useState, ChangeEvent, useEffect } from "react"; // Importar useEffect
import ModalComponent from "@/components/Modal";

import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { User } from "../types";
import { usePatchUsers } from "../hooks/usePatchUsers";

// Librerías de validación de campos
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { phoneSchema } from "@/schemas/validacionesTypes";

const userEditSchema = z.object({
  id: z.number().optional(),
  telefono: phoneSchema,
});

type UserEditInputs = z.infer<typeof userEditSchema>;

interface EditarUserModalProps {
  user: User;
  onClose: () => void; // Función para cerrar el modal
}

const EditarUserModal: React.FC<EditarUserModalProps> = ({ user, onClose }) => {
  // --- Paso 1: Configurar React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserEditInputs>({
    resolver: zodResolver(userEditSchema),

    defaultValues: {
      id: user.id,
      telefono: user.telefono,
    },
  });

  const [otherUserData, setOtherUserData] = useState({
    identificacion: user.identificacion.toString(),
    nombre: user.nombre,
    apellidos: user.apellidos,
    correoElectronico: user.correoElectronico,
    estado: user.estado,
    admin: user.admin,
    rol: user.rol,
  });

  useEffect(() => {
    reset({
      id: user.id,
      telefono: user.telefono,
    });
    setOtherUserData({
      identificacion: user.identificacion.toString(),
      nombre: user.nombre,
      apellidos: user.apellidos,
      correoElectronico: user.correoElectronico,
      estado: user.estado,
      admin: user.admin,
      rol: user.rol,
    });
  }, [user, reset]); // Dependencia en 'user' y 'reset' de RHF

  const { mutate, isPending } = usePatchUsers();

  // --- Manejo de Inputs que NO son validados por RHF ---
  const handleOtherInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof otherUserData
  ) => {
    setOtherUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Observa el valor actual del teléfono para el input controlado
  const currentTelefono = watch("telefono");

  // --- Manejador de cambio para el Input de Teléfono con filtrado ---
  const handleTelefonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleanValue = value.replace(/[^0-9()+]/g, "");
    setValue("telefono", cleanValue, { shouldValidate: true }); // Actualiza RHF y valida
  };

  const handleRoleChange = (selectedKey: string) => {
    setOtherUserData((prev) => ({
      ...prev,
      rol: selectedKey,
    }));
  };

  const handleEstadoSwitchChange = (isSelected: boolean) => {
    setOtherUserData((prev) => ({
      ...prev,
      estado: isSelected ? "activo" : "inactivo",
    }));
  };

  const roles = [
    { key: "admin", label: "admin" },
    { key: "instructor", label: "instructor" },
    { key: "pasante", label: "pasante" },
    { key: "aprendiz", label: "aprendiz" },
    { key: "visitante", label: "visitante" },
  ];

  // --- Función de envío principal con validación de React Hook Form ---
  const onSubmit = (data: UserEditInputs) => {
    mutate(
      {
        id: user.id,
        data: {
          ...otherUserData, // Campos gestionados por useState
          telefono: data.telefono, // Teléfono validado por RHF
          identificacion: Number(otherUserData.identificacion), // Convertir a número si es necesario
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Error al editar usuario:", error);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Usuario"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit(onSubmit), // Usa handleSubmit de React Hook Form
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          size="sm"
          label="Identificación"
          type="number"
          value={otherUserData.identificacion}
          onChange={(e) => handleOtherInputChange(e, "identificacion")}
          required
        />

        <Input
          label="Nombre"
          type="text"
          size="sm"
          value={otherUserData.nombre}
          onChange={(e) => handleOtherInputChange(e, "nombre")}
          required
        />

        <Input
          label="Apellidos"
          type="text"
          size="sm"
          value={otherUserData.apellidos}
          onChange={(e) => handleOtherInputChange(e, "apellidos")}
        />

        <Input
          label="Teléfono"
          type="tel"
          size="sm"
          value={currentTelefono}
          {...register("telefono", { onChange: handleTelefonoChange })}
          isInvalid={!!errors.telefono}
          errorMessage={errors.telefono?.message}
          placeholder="Ej: +1 (555) 123-4567"
        />

        <Input
          label="Correo Electrónico"
          type="email"
          size="sm"
          value={otherUserData.correoElectronico}
          onChange={(e) => handleOtherInputChange(e, "correoElectronico")}
          required
        />

        <Select
          label="rol"
          size="sm"
          selectedKeys={otherUserData.rol ? [otherUserData.rol] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            handleRoleChange(selectedKey);
          }}
        >
          {roles.map((rol) => (
            <SelectItem key={rol.key}>{rol.label}</SelectItem>
          ))}
        </Select>

        <Switch
          size="sm"
          color="success"
          isSelected={otherUserData.estado === "activo"}
          onValueChange={handleEstadoSwitchChange}
        >
          Usuario Activo
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarUserModal;

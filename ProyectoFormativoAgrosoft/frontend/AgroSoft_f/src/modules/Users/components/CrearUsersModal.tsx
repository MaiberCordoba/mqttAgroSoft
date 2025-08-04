import { useState, ChangeEvent } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { usePostUsers } from "../hooks/usePostUsers";
// Librerías validación campos
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  requiredString,
  emailSchema,
  phoneSchema,
  identificationSchema,
  passwordSchema,
} from "@/schemas/validacionesTypes";
import { addToast } from "@heroui/toast"; // Asumo que esta importación es correcta

const userSchema = z.object({
  id: z.number().optional(),
  identificacion: identificationSchema,
  nombre: requiredString,
  apellidos: requiredString,
  telefono: phoneSchema,
  correoElectronico: emailSchema,
  password: passwordSchema,
  rol: requiredString,
});

type UserFormInputs = z.infer<typeof userSchema>;

interface CrearUsersModalProps {
  onClose: () => void;
}

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "instructor", label: "Instructor" },
  { value: "pasante", label: "Pasante" },
  { value: "visitante", label: "visitante" },
  { value: "aprendiz", label: "aprendiz" },
];

export const CrearUsersModal = ({ onClose }: CrearUsersModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      identificacion: "",
      nombre: "",
      apellidos: "",
      telefono: "",
      correoElectronico: "",
      password: "",
      rol: "",
    },
  });

  const { mutate, isPending } = usePostUsers();

  const currentRol = watch("rol");
  const currentTelefono = watch("telefono");

  const handleTelefonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleanValue = value.replace(/[^0-9()+]/g, "");
    setValue("telefono", cleanValue, { shouldValidate: true });
  };

  const handleRolSelectChange = (selection: Set<any> | "all") => {
    let selectedValue: string = "";
    if (selection === "all") {
      console.warn("Unexpected 'all' selection in single-select dropdown.");
      selectedValue = "";
    } else if (selection instanceof Set) {
      const selectedArray = Array.from(selection).map((key) => String(key));
      selectedValue = selectedArray[0] || "";
    } else {
      console.error("Unexpected selection type:", selection);
      selectedValue = "";
    }
    setValue("rol", selectedValue, { shouldValidate: true });
  };

  const onErrors = (errors: FieldErrors<UserFormInputs>) => {
    console.log("Errores de validación detectados:", errors);

    addToast({
      title: "Campos Incompletos",
      description:
        "Por favor, completa todos los campos requeridos correctamente.",
      color: "danger",
    });
  };

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    mutate(data, {
      onSuccess: () => {
        onClose();
        reset();
      },
      onError: (error) => {
        console.error("Error al registrar usuario (desde mutación):", error);
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Usuario"
      footerButtons={[
        {
          label: isSubmitting || isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit(onSubmit, onErrors),
        },
      ]}
    >
      <Input
        size="sm"
        isRequired
        label="Identificación"
        type="number"
        {...register("identificacion")}
        isInvalid={!!errors.identificacion}
        errorMessage={errors.identificacion?.message}
      />

      <Input
        size="sm"
        isRequired
        label="Nombre"
        type="text"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        size="sm"
        isRequired
        label="Apellidos"
        type="text"
        {...register("apellidos")}
        isInvalid={!!errors.apellidos}
        errorMessage={errors.apellidos?.message}
      />

      <Input
        size="sm"
        isRequired
        label="Teléfono"
        type="tel"
        value={currentTelefono}
        {...register("telefono", { onChange: handleTelefonoChange })}
        isInvalid={!!errors.telefono}
        errorMessage={errors.telefono?.message}
        placeholder="Ej: +57 3229904567"
      />

      <Input
        size="sm"
        isRequired
        label="Correo Electrónico"
        type="email"
        {...register("correoElectronico")}
        isInvalid={!!errors.correoElectronico}
        errorMessage={errors.correoElectronico?.message}
      />

      <Input
        size="sm"
        isRequired
        label="Contraseña"
        type="password"
        {...register("password")}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />

      <Select
        size="sm"
        isRequired
        label="Rol"
        selectedKeys={currentRol ? new Set([currentRol]) : new Set()}
        onSelectionChange={handleRolSelectChange}
        isInvalid={!!errors.rol}
        errorMessage={errors.rol?.message}
      >
        {ROLES.map((role) => (
          <SelectItem key={role.value}>{role.label}</SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

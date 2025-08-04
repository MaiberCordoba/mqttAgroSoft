// src/schemas/commonValidation.ts

import { z } from "zod";

// Validación para un campo de texto requerido
export const requiredString = z.string().min(1, "Este campo es requerido.");

// Validación para un campo de number requerido
export const requiredNumber = z
  .number()
  .min(1, "Este campo es requerido y debe ser un número válido.");

// Validación para un campo de email
export const emailSchema = z
  .string()
  .min(1, "El correo electrónico es requerido.")
  .email("Formato de correo electrónico inválido.");

// Validación para el campo de teléfono con la regex específica
export const phoneSchema = z
  .string()
  .min(1, "El teléfono es requerido.")
  .regex(
    /^[0-9()+]+$/,
    "El teléfono solo puede contener números, paréntesis y el signo '+'."
  );

// Validación para la identificación (número)
export const identificationSchema = z
  .string()
  .min(1, "La identificación es requerida."); // Si es string de números
// O si es number: z.number().int("Debe ser un número entero.").min(1, "La identificación es requerida.");

// Validación para contraseñas con reglas específicas (ej. mínimo 6 caracteres)
export const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres.");

// Puedes crear esquemas para propiedades comunes o "mixins"
export const auditSchema = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  // ... otras propiedades de auditoría
});

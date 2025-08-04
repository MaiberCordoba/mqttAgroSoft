import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");

  const executeWithRole = async (role: string, action: () => void) => {
    await context.refreshUser();
    if (context.user?.rol === role) {
      action();
    } else {
      console.error(`Acceso denegado: Se requiere rol ${role}`);
      // Puedes agregar un toast aquí
    }
  };

  return {
    ...context,
    hasRole: (role: string) => context.user?.rol === role,
    hasAnyRole: (roles: string[]) => roles.includes(context.user?.rol || ""),
    executeWithRole,
  };
};

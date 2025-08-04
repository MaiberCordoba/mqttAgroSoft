import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSalario } from "../../api/salariosApi";
import { Salarios } from "../../types";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/hooks/UseAuth";

export const usePostSalario = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  return useMutation<Salarios, Error, Salarios>({
    mutationKey: ["crearSalario"],
    mutationFn: async (salario) => {
      if (userRole !== "admin") {
        throw new Error("Solo los administradores pueden crear salarios");
      }
      return postSalario(salario);
    },
    onSuccess: (data) => {
      console.log("Salario creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ["salarios"] });

      addToast({
        title: "Creación exitosa",
        description: "Nuevo salario registrado con éxito",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error al crear el salario:", error);
      addToast({
        title: "Error al crear el salario",
        description:
          error.message === "Solo los administradores pueden crear salarios"
            ? "No tienes permiso para crear salarios"
            : "No fue posible registrar un nuevo salario",
        color: "danger",
      });
    },
  });
};

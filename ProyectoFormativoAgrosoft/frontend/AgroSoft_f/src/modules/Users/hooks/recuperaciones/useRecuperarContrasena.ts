import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useRecuperarContrasena = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      try {
        const { data } = await axios.post(`${apiUrl}solicitar-recuperacion/`, { email });
        return data;
      } catch (error) {
        // Opcional: lanzar el error con un mensaje legible
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || "Correo no válido. Por favor verifica e intenta de nuevo.");
        }
        throw error;
      }
    },
  });
};

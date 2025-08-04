import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // Verificar si el token está a punto de expirar (menos de 5 minutos)
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      const expirationBuffer = 5 * 60; // 5 minutos en segundos
      
      if (decoded.exp - currentTime < expirationBuffer) {
        console.warn("Token a punto de expirar");
        // Aquí podrías implementar renovación automática si usas refresh tokens
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Token inválido:", error);
      // Eliminar token inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuesta para manejar tokens inválidos
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
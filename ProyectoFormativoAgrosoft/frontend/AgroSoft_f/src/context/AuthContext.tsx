import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/modules/Users/types";
import apiClient from "@/api/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;
}

interface JwtPayload {
  exp: number;
  user_id: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      if (!token) return null;
      const response = await apiClient.get("/usuarios/me/");
      const userData = response.data;
      if (userData.estado === "inactivo") {
        logout();
        addToast({
          title: "Cuenta inactiva",
          description: "Tu cuenta está inactiva. Contacta al administrador.",
          color: "danger",
        });
        return null;
      }
      return userData;
    },
    enabled: !!token,
    staleTime: 0,
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const isTokenValid = useCallback((tokenString: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(tokenString);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      console.error("Token inválido:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const verifyToken = () => {
      const storedToken = localStorage.getItem("token");

      // Actualizar el estado si el token en localStorage cambió
      if (storedToken !== token) {
        setToken(storedToken);
        if (!storedToken) {
          console.log("Token eliminado de localStorage, ejecutando logout");
          logout();
          return;
        }
      }

      if (window.location.pathname === "/login") {
        setIsAuthenticated(false);
        return;
      }

      if (token && isTokenValid(token)) {
        setIsAuthenticated(true);
        refetchUser();
      } else {
        console.log("Token no válido, ejecutando logout");
        logout();
      }
    };

    verifyToken();
    const interval = setInterval(verifyToken, 5 * 1000); // Reducido a 5 segundos
    return () => clearInterval(interval);
  }, [token, isTokenValid, refetchUser]);

  // Escuchar cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && event.newValue === null) {
        console.log("Token eliminado de localStorage, ejecutando logout");
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.addEventListener("storage", handleStorageChange);
  }, []);

  const login = (token: string, userData: User) => {
    if (userData.estado === "inactivo") {
      localStorage.removeItem("token");
      setToken(null);
      addToast({
        title: "Cuenta inactiva",
        description: "Tu cuenta está inactiva. Contacta al administrador.",
        color: "danger",
      });
      return;
    }
    localStorage.setItem("token", token);
    setToken(token);
    queryClient.setQueryData(["current-user"], userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("Ejecutando logout, ruta actual:", window.location.pathname);
    localStorage.removeItem("token");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["current-user"] });
    setIsAuthenticated(false);
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  };

  const updateUser = (userData: User) => {
    queryClient.setQueryData(["current-user"], userData);
  };

  const refreshUser = async () => {
    await refetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        role: user?.rol || null,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

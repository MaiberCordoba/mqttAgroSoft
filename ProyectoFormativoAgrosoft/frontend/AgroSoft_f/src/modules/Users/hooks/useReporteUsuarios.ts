import { useQuery } from "@tanstack/react-query";
import { getReporteUsuarios } from "@/modules/Users/api/usersApi";

export interface ReporteUsuarios {
  total_usuarios: number;
  usuarios_activos: number;
  usuarios_inactivos: number;
}

export const useReporteUsuarios = () => {
  return useQuery<ReporteUsuarios>({
    queryKey: ["reporte_usuarios"],
    queryFn: getReporteUsuarios,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
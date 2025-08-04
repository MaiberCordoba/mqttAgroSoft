import { useEffect, useState } from "react";
import { UsersList } from "../components/UsersList";
import { useAuth } from "@/hooks/UseAuth";
import { MapPage } from "@/modules/Trazabilidad/pages/MapaPage";
import EditarPerfilModal from "../components/UserPerfil";

export function Usuarios() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useAuth(); // Obtiene el usuario autenticado

  useEffect(() => {
    // Cuando el componente se monta, verifica el rol del usuario
    if (user) {
      setUserRole(user.rol);
    }
  }, [user]);

  if (userRole === null) {
    // Mientras se verifica el rol, puedes mostrar un loader
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {userRole === "admin" ? (
        <UsersList />
      ) : (
        <EditarPerfilModal /> // Reemplaza con tu componente para no-admins
      )}
    </div>
  );
}
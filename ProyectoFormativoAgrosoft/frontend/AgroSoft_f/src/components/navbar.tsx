// components/Navbar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import NotificationsModal from "@/modules/Notificaciones/components/NotificationsModal";
import { useNotificationsContext } from "@/context/NotificationsContext";
import EditarPerfilModal from "@/modules/Users/components/UserPerfil";

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
  toggleSidebar,
}) => {
  const { user, logout } = useAuth();
  const { notificaciones } = useNotificationsContext(); // Usar contexto
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

   const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
    if (isMobileMenuOpen) onMobileMenuToggle();
  };
  
  const unreadCount = notificaciones.filter((n) => !n.is_read).length;

  // Depuración
  console.log("Notificaciones en Navbar:", notificaciones);
  console.log("Unread Count:", unreadCount);

  return (
    <>
      <nav className="flex items-center justify-between h-full px-4 md:px-6 text-white bg-sena-green">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-[#25a902] md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img src="/logoSenaW.png" alt="SENA" className="h-10" />
            <div className="h-8 w-px bg-white/30" />
            <img src="/logoAgrosofWB.png" alt="Agrosoft" className="h-9" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.nombre}</span>
                 <button 
                  onClick={toggleProfileModal}
                  className="w-8 h-8 rounded-full bg-white text-sena-green flex items-center justify-center font-semibold hover:bg-gray-100 transition-colors"
                >
                  {getInitials(user.nombre)}
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="relative p-1 rounded-full hover:bg-[#25a902]"
                >
                  <Bell size={25} className="cursor-pointer hover:text-gray-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-gray-200"
              >
                <LogOut size={25} />
              </button>
            </div>
          )}
          <div className="md:hidden relative">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-full hover:bg-[#25a902]"
            >
              {user?.nombre ? (
                <div className="w-8 h-8 rounded-full bg-white text-sena-green flex items-center justify-center font-semibold">
                  {getInitials(user.nombre)}
                </div>
              ) : (
                <User size={24} />
              )}
            </button>
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-xl w-48 z-50">
                {user?.nombre && (
                  <div className="px-3 py-2 font-medium border-b">
                    {user.nombre}
                  </div>
                )}
                <div className="p-2 space-y-2">
                  {user && (
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(true);
                        onMobileMenuToggle();
                      }}
                      className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
                    >
                      <Bell size={18} />
                      Notificaciones
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded"
                    onClick={toggleProfileModal}
                  >
                    <User size={18} /> Perfil
                  </button>
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-red-600"
                    >
                      <LogOut size={18} /> Cerrar sesión
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
          {user && (
        <>
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
          
          <EditarPerfilModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onUpdateSuccess={() => {
              // Forzar actualización del contexto/auth
              // Esto hará que el navbar se actualice
              window.location.reload();
            }}
          />
        </>
        
      )}
    </>
  );
};

export default Navbar;
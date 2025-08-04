import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Monitor,
  Calendar,
  MapPin,
  Leaf,
  DollarSign,
  Wrench,
  ShieldCheck,
  ChevronDown,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";

interface SidebarProps {
  isOpen: boolean;
  isHovering?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isHovering,
  toggleSidebar,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserRole(user.rol);
    } else {
      setUserRole(null);
    }
  }, [user]);

  // Función para filtrar submenús
  const getFilteredSubmenus = (title: string, submenus: string[]): string[] => {
    if (title === "Cultivos" && userRole === "visitante") {
      return submenus.filter(
        (sub) =>
          ![
            "Semilleros",
            "Cultivos",
            "Lotes",
            "Eras",
            "Especies",
            "Tipos Especie",
          ].includes(sub)
      );
    }

    if (title === "Fitosanitario" && userRole === "visitante") {
      return submenus.filter(
        (sub) =>
          ![
            "Tipos de afectaciones",
            "Afectaciones",
            "tipos de control",
          ].includes(sub)
      );
    }

    if (
      (title === "Inventario" && userRole === "aprendiz") ||
      userRole === "visitante"
    ) {
      return submenus.filter(
        (sub) => !["Usos Herramientas", "Usos Insumos"].includes(sub)
      );
    }
    return submenus;
  };

  const toggleMenu = (menu: string) => {
    if (!isOpen && toggleSidebar) {
      toggleSidebar();
      setTimeout(() => {
        setOpenMenu(menu);
      }, 300);
    } else {
      setOpenMenu(openMenu === menu ? null : menu);
    }
  };

  const mainItems = [
    { icon: Home, color: "text-[#254030]", text: "Home", to: "/home" },
    ...(userRole === "admin"
      ? [
          {
            icon: Users,
            color: "text-[#254030]",
            text: "Usuarios",
            to: "/usuarios",
          },
        ]
      : []),
  ];

  // Lista base de menús
  const baseMenuItems = [
    {
      title: "IoT",
      icon: Monitor,
      submenus: ["sensores", 
        "evapotranspiracion",
        "mqtt"],
    },
    {
      title: "Cultivos",
      icon: Leaf,
      color: "text-[#254030]",
      submenus: [
        "Tipos Especie",
        "Especies",
        "Cultivos",
        "Semilleros",
        "Lotes",
        "Eras",
        "Informacion Cultivos Sembrados",
      ],
    },
    {
      title: "Actividades",
      icon: Wrench,
      color: "text-[#254030]",
      submenus: [
        "Actividades",
        "Tipos Actividad",
        "Unidades medida",
        "Unidades tiempo",
      ],
    },
    {
      title: "Finanzas",
      icon: DollarSign,
      color: "text-[#254030]",
      submenus: ["Cosechas", "Ventas", "Salarios", "pagos", "resumen finanzas"],
    },
    {
      title: "Inventario",
      icon: ClipboardList,
      color: "text-[#254030]",
      submenus: [
        "Bodega",
        "Insumos",
        "Herramientas",
        "Usos Herramientas",
        "Usos Insumos",
      ],
    },
    {
      title: "Fitosanitario",
      icon: ShieldCheck,
      color: "text-[#254030]",
      submenus: [
        "Tipos de afectaciones",
        "Afectaciones",
        "Afectaciones en cultivos",
        "tipos de control",
        "Controles",
        "Seguimiento de afectaciones",
      ],
    },
  ];

  // Filtrar menús completos para visitantes y aprendices
  const filteredMenuItems = baseMenuItems
    .filter((menu) => {
      // Ocultar completamente el menú "Actividades" para visitantes
      if (userRole === "visitante" && menu.title === "Actividades") {
        return false;
      }
      // Ocultar completamente el menú "Finanzas" para visitantes y aprendices
      if (
        ["visitante", "aprendiz"].includes(userRole || "") &&
        menu.title === "Finanzas"
      ) {
        return false;
      }
      return true;
    })
    .map((menu) => ({
      ...menu,
      submenus: getFilteredSubmenus(menu.title, menu.submenus),
    }));

  return (
    <aside
      className={`h-full bg-white shadow-lg flex flex-col transition-all duration-300 ${
        isOpen ? "w-48" : "w-20"
      }`}
    >
      {toggleSidebar && (
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-4 bg-white rounded-full p-1 shadow-lg border
            transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}
            hover:bg-gray-100 z-50`}
        >
          {isOpen ? (
            <ChevronLeft size={20} className="text-gray-600" />
          ) : (
            <ChevronRight size={20} className="text-gray-600" />
          )}
        </button>
      )}

      <nav className="flex-1 overflow-y-auto p-2">
        {mainItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 p-2 rounded-lg mb-1 text-sm
              hover:bg-gray-200 transition-colors
              ${isActive ? "bg-gray-200 font-medium" : ""}
              ${!isOpen ? "justify-center" : ""}
            `}
          >
            <item.icon size={20} className={item.color} />
            {isOpen && <span>{item.text}</span>}
          </NavLink>
        ))}

        {/* Usar la lista filtrada de menús */}
        {filteredMenuItems.map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-200 ${
                menu.submenus.some((sub) =>
                  location.pathname.includes(
                    sub.toLowerCase().replace(/\s+/g, "-")
                  )
                )
                  ? "bg-gray-200"
                  : ""
              } ${!isOpen ? "justify-center px-0" : "justify-between"}`}
              onClick={() => toggleMenu(menu.title)}
            >
              <div
                className={`flex items-center ${isOpen ? "gap-3" : "justify-center w-full"}`}
              >
                <menu.icon size={20} className={menu.color} />
                {isOpen && <span className="text-sm">{menu.title}</span>}
              </div>
              {isOpen && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === menu.title ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>

            {isOpen && openMenu === menu.title && menu.submenus.length > 0 && (
              <div className={`overflow-hidden transition-all duration-300`}>
                <div className="scroll-custom max-h-[150px] overflow-y-auto">
                  {menu.submenus.map((submenu) => {
                    const path = `/${submenu.toLowerCase().replace(/\s+/g, "-")}`;
                    return (
                      <NavLink
                        key={submenu}
                        to={path}
                        className={({ isActive }) =>
                          `block pl-8 py-1 text-xs text-gray-800 hover:bg-gray-100 rounded-lg ${
                            isActive ? "bg-gray-200 font-medium" : ""
                          }`
                        }
                      >
                        {submenu}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        <NavLink
          to="/calendario"
          className={({ isActive }) => `
            flex items-center p-2 rounded-lg hover:bg-gray-200  text-[#254030]
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isOpen ? "justify-center px-0" : "gap-3"}
          `}
        >
          <Calendar size={20} />
          {isOpen && <span className="text-sm">Calendario</span>}
        </NavLink>
        <NavLink
          to="/mapa"
          className={({ isActive }) => `
            flex items-center p-2 rounded-lg hover:bg-gray-200 text-[#254030]
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isOpen ? "justify-center px-0" : "gap-3"}
          `}
        >
          <MapPin size={20} />
          {isOpen && <span className="text-sm">Mapa</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

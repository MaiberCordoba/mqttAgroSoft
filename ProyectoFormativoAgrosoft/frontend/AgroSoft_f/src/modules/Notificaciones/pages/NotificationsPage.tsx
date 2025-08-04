// pages/NotificationsPage.tsx
import { useState } from "react";
import { Bell, ChevronLeft, CheckCircle2, MessageSquare, Zap, AlertTriangle, Settings, Calendar, Sprout, CheckCircle, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/UseAuth";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { parseNotificationMessage } from "../utils/parseNotification";

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notificaciones, marcarLeida, marcarTodasLeidas } = useNotificationsContext();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!user) {
    navigate("/login");
    return null;
  }

  const filteredNotifications = notificaciones.filter((n) => {
    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "controles" && n.notification_type === "control") ||
      (filterCategory === "actividades" && n.notification_type === "activity");
    return matchesCategory;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.is_read).length;

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "message":
        return { icon: <MessageSquare size={16} />, bg: "bg-blue-50", text: "text-blue-500" };
      case "activity":
        return { icon: <Zap size={16} />, bg: "bg-green-50", text: "text-green-500" };
      case "control":
        return { icon: <AlertTriangle size={16} />, bg: "bg-orange-50", text: "text-orange-500" };
      case "system":
        return { icon: <Settings size={16} />, bg: "bg-purple-50", text: "text-purple-500" };
      default:
        return { icon: <Bell size={16} />, bg: "bg-gray-50", text: "text-gray-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-5">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto"> {/* Changed max-w-4xl to max-w-5xl */}
        <Link
          to="/home"
          className="flex items-center bg-sena-green text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="ml-2 font-medium">Volver</span>
        </Link>
        <h1 className="text-xl font-bold text-white flex items-center">
          Notificaciones
        </h1>
        <div className="w-16"></div>
      </div>

      {/* Filtros */}
      <div className="max-w-5xl mx-auto mb-6"> {/* Changed max-w-4xl to max-w-5xl */}
        <div className="bg-white p-3 rounded-md shadow-sm flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-sena-green focus:ring-sena-green sm:text-sm p-2"
            >
              <option value="all">Todos</option>
              <option value="controles">Controles</option>
              <option value="actividades">Actividades</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto"> {/* Changed max-w-4xl to max-w-5xl */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div className="p-3 bg-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">
                {unreadCount > 0
                  ? `${unreadCount} notificaciones no leídas`
                  : "Todas las notificaciones leídas"}
              </span>
              {unreadCount > 0 && (
                <span className="bg-sena-green text-white text-xs font-medium rounded-full px-2.5 py-1">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            <button
              onClick={marcarTodasLeidas}
              className="flex items-center gap-2 text-sm text-sena-green hover:text-green-600 disabled:opacity-50"
              disabled={unreadCount === 0}
            >
              <CheckCircle2 size={16} className="mr-1" />
              Marcar todas como leídas
            </button>
          </div>

          {/* Lista de Notificaciones con Scroll */}
          <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar"> {/* Added max-h-[60vh] and overflow-y-auto */}
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                <Bell size={40} className="text-gray-400 mb-3" />
                <p className="text-lg">No hay notificaciones</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const { icon, bg, text } = getNotificationStyle(notification.notification_type);
                const meta = parseNotificationMessage(notification.message);
                return (
                  <div
                    key={notification.id}
                    onClick={() => marcarLeida(notification.id)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors rounded-md ${
                      !notification.is_read ? bg : "bg-white"
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`flex-shrink-0 ${text}`}>{icon}</div>
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${
                            !notification.is_read ? "text-sena-green" : "text-gray-700"
                          }`}
                        >
                          {meta.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{meta.description}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className={text} />
                            <span>
                              <span className="font-semibold text-gray-700">Fecha: </span>
                              {meta.date || format(parseISO(notification.created_at), "d MMM yyyy", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Sprout size={12} className={text} />
                            <span>
                              <span className="font-semibold text-gray-700">Tipo: </span>
                              {meta.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle size={12} className={text} />
                            <span>
                              <span className="font-semibold text-gray-700">Estado: </span>
                              {meta.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Leaf size={12} className={text} />
                            <span>
                              <span className="font-semibold text-gray-700">Cultivo: </span>
                              {meta.crop}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="mt-6 max-w-5xl mx-auto text-sm text-white"> {/* Changed max-w-4xl to max-w-5xl */}
        <span>Mostrando {filteredNotifications.length} notificaciones</span>
      </div>
    </div>
  );
};

export default NotificationsPage;
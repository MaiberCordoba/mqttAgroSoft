// components/NotificationsModal.tsx
import { Bell, X, MessageSquare, Zap, AlertTriangle, Settings, Calendar, Sprout, CheckCircle, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { parseNotificationMessage } from "../utils/parseNotification";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notificaciones, marcarLeida, marcarTodasLeidas } = useNotificationsContext();

  if (!isOpen) return null;

  const unreadCount = notificaciones.filter((n) => !n.is_read).length;

  // Mapear íconos y colores según notification_type
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
    <div
      className={`fixed inset-0 z-50 flex justify-end pt-14 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative z-50 w-full max-w-sm bg-white rounded-l-lg shadow-lg h-[calc(100vh-3.5rem)] flex flex-col"
      >
        {/* Encabezado */}
        <div className="p-4 bg-sena-green text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="bg-white text-sena-green text-xs font-medium rounded-full px-2 py-0.5">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                marcarTodasLeidas();
              }}
              className="text-xs hover:underline"
            >
              Marcar todas
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-green-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lista de Notificaciones */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {notificaciones.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map((notification) => {
              const { icon, bg, text } = getNotificationStyle(notification.notification_type);
              const meta = parseNotificationMessage(notification.message);
              return (
                <div
                  key={notification.id}
                  onClick={() => marcarLeida(notification.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${
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

        {/* Pie */}
        <div className="p-3 border-t border-gray-200 bg-white text-center">
          <Link
            to="/notificaciones"
            className="text-sm text-sena-green hover:underline font-medium"
            onClick={onClose}
          >
            Ver todas las notificaciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
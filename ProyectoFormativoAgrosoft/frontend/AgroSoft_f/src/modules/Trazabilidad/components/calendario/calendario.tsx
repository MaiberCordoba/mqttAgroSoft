import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/modules/Trazabilidad/components/calendario/calendario.css";

import { useEffect, useState } from "react";
import { Actividades } from "@/modules/Finanzas/types";
import { Controles } from "@/modules/Sanidad/types";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: "Todo el día",
  previous: "Atrás",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Actividad",
  noEventsInRange: "No hay actividades en este rango",
  showMore: (total: number) => `+ Ver más (${total})`,
};

interface EventoCalendario {
  title: string;
  start: Date;
  end: Date;
  tipo: "actividad" | "control";
}

export default function CalendarioActividades() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [vistaActual, setVistaActual] = useState<View>("month");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token disponible. Inicia sesión.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchActividades = fetch("http://127.0.0.1:8000/api/actividades/", { headers })
      .then((res) => {
        if (res.status === 401) throw new Error("No autorizado");
        return res.json();
      })
      .then((data: Actividades[]) =>
        data.map((actividad) => ({
          title: `Actividad: ${actividad.titulo}${actividad.usuario ? ` - ${actividad.usuario.nombre}` : ""}`,
          start: new Date(actividad.fecha + "T12:00:00"),
          end: new Date(actividad.fecha + "T12:00:00"),
          tipo: "actividad" as const,
        }))
      );

    const fetchControles = fetch("http://127.0.0.1:8000/api/controles/", { headers })
      .then((res) => {
        if (res.status === 401) throw new Error("No autorizado");
        return res.json();
      })
      .then((data: Controles[]) =>
        data.map((control) => ({
          title: `Control: ${control.descripcion}${control.usuario ? ` - ${control.usuario.nombre}` : ""}`,
          start: new Date(control.fechaControl + "T12:00:00"),
          end: new Date(control.fechaControl + "T12:00:00"),
          tipo: "control" as const,
        }))
      );

    Promise.all([fetchActividades, fetchControles])
      .then(([eventosActividades, eventosControles]) => {
        setEventos([...eventosActividades, ...eventosControles]);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        if (err.message === "No autorizado") {
          alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        }
      });
  }, []);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setFechaSeleccionada(start);
    setVistaActual("agenda");
  };

  const handleSelectEvent = (event: EventoCalendario) => {
    setFechaSeleccionada(event.start);
    setVistaActual("agenda");
  };

  const eventosFiltrados = vistaActual === "agenda" && fechaSeleccionada
    ? eventos.filter((e) => e.start.toDateString() === fechaSeleccionada.toDateString())
    : eventos;

  const CustomEvent = ({ event }: { event: EventoCalendario }) => {
    const style: React.CSSProperties = {
      backgroundColor: event.tipo === "actividad" ? "#2D7844" : "#2D4878",
      color: "white",
      borderRadius: "8px",
      padding: "4px 8px",
      fontSize: "0.75rem",
      fontWeight: 600,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
    return <div style={style}>{event.title}</div>;
  };

  return (
    <div className="calendario-contenedor">
      <div className="calendario-titulo">Calendario de Actividades y Controles</div>
      <Calendar
        localizer={localizer}
        events={eventosFiltrados}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        culture="es"
        style={{ height: 700 }}
        views={["month", "agenda"]}
        view={vistaActual}
        onView={(view) => {
          setVistaActual(view);
          if (view === "month") setFechaSeleccionada(null);
        }}
        date={fechaSeleccionada ?? new Date()}
        onNavigate={(date) => setFechaSeleccionada(date)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{
          event: CustomEvent,
          agenda: {
            event: CustomEvent,
            time: () => null,
          },
        }}
        dayPropGetter={() => ({
          style: {
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          },
        })}
      />
    </div>
  );
}

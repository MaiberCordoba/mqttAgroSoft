import { TiempoActividadCard } from "../CardFinanzas";
import { ActividadesList } from "../components/actividades/ActividadesList";

export function Actividades() {
  return (
    <div>
      <h1 className="text-4xl p-4 font-serif">Actividades realizadas</h1>
      <div className="p-4">
        <TiempoActividadCard />
      </div>
      <h1 className="text-4xl p-4 font-serif">Actividades asignadas</h1>
      <ActividadesList />
    </div>
  );
}

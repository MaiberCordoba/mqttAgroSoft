import { CosechasResumenCard } from "../CardFinanzas";
import { VentasList } from "../components/ventas/VentasList";

export function Ventas() {
  return (
    <div>
      <div className="p-4">
        <CosechasResumenCard/>
      </div>
      <VentasList />
    </div>
  );
}

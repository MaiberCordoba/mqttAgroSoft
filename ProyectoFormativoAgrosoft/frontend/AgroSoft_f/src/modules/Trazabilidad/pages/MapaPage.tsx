import { useState } from "react";
import { FiltroEspecies } from "../components/especies/FiltrosEspecie";
import MapComponent from "../components/mapa/Mapa";

// MapPage.tsx
export const MapPage = () => {
  const [especieSeleccionada, setEspecieSeleccionada] = useState<string>("");

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      {/* Contenedor principal */}
      <div className="flex-1 flex gap-4 p-4 ">
        {/* Contenedor del mapa (izquierda) */}
        <div className="w-[400px] h-[400px] bg-white rounded-lg shadow-lg p-2">
          <MapComponent filtroEspecie={especieSeleccionada} />
        </div>

        {/* Contenedor de contenido adicional (derecha) */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4">filtros</h2>
          <FiltroEspecies
            selectedEspecie={especieSeleccionada}
            onEspecieChange={setEspecieSeleccionada}
          />
        </div>
      </div>
    </div>
  );
};

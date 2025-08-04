import { MapContainer, TileLayer, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { MapComponentProps, Plantaciones, Lotes } from "../../types";

const MapComponent = ({ filtroEspecie }: MapComponentProps) => {
  const { data: lotes } = useGetLotes();
  const { data: plantaciones } = useGetPlantaciones();

  // Depuración: Imprimir datos
  console.log("Plantaciones:", plantaciones);

  // Filtrar plantaciones basado en el filtro de especie
  const plantacionesFiltradas = plantaciones?.filter(
    (plantacion: Plantaciones) => {
      if (!filtroEspecie) return true;
      return plantacion.cultivo?.especies?.id.toString() === filtroEspecie;
    }
  );

  // Agrupar plantaciones por eras.id
  const plantacionesPorEra = plantacionesFiltradas?.reduce(
    (acc, plantacion) => {
      const eraId = plantacion.eras?.id;
      if (!eraId) return acc; // Saltar si no hay era
      if (!acc[eraId]) {
        acc[eraId] = {
          era: plantacion.eras,
          plantaciones: [],
        };
      }
      acc[eraId].plantaciones.push(plantacion);
      return acc;
    },
    {} as Record<
      number,
      { era: Plantaciones["eras"]; plantaciones: Plantaciones[] }
    >
  );

  // Depuración: Imprimir plantaciones agrupadas
  console.log("Plantaciones por era:", plantacionesPorEra);

  // Crear polígonos
  const crearPoligono = (
    latI1: number,
    longI1: number,
    latS1: number,
    longS1: number,
    latI2: number,
    longI2: number,
    latS2: number,
    longS2: number
  ): LatLngTuple[] => {
    return [
      [latI1, longI1],
      [latS1, longS1],
      [latS2, longS2],
      [latI2, longI2],
      [latI1, longI1],
    ];
  };

  return (
    <MapContainer
      center={[1.892429, -76.089677]}
      zoom={18}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Lotes - Azul */}
      {lotes?.map((lote: Lotes) => (
        <Polygon
          key={`lote-${lote.id}`}
          positions={crearPoligono(
            lote.latI1,
            lote.longI1,
            lote.latS1,
            lote.longS1,
            lote.latI2,
            lote.longI2,
            lote.latS2,
            lote.longS2
          )}
          pathOptions={{ color: "blue", weight: 2, fillOpacity: 0.2 }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{lote.nombre}</h3>
              <p className="text-sm">
                Estado: {lote.estado ? "Activo" : "Inactivo"}
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Eras - Verde */}
      {plantacionesPorEra &&
        Object.entries(plantacionesPorEra).map(
          ([eraId, { era, plantaciones }]) => {
            // Validar que la era tenga las propiedades necesarias
            if (
              !era ||
              !era.latI1 ||
              !era.longI1 ||
              !era.latS1 ||
              !era.longS1 ||
              !era.latI2 ||
              !era.longI2 ||
              !era.latS2 ||
              !era.longS2
            ) {
              console.warn("Era inválida:", era, "Plantaciones:", plantaciones);
              return null;
            }

            // Depuración: Imprimir era renderizada
            console.log(
              `Renderizando era ID: ${eraId}, Tipo: ${era.tipo}, Plantaciones: ${plantaciones.length}`
            );

            return (
              <Polygon
                key={`era-${eraId}`}
                positions={crearPoligono(
                  era.latI1,
                  era.longI1,
                  era.latS1,
                  era.longS1,
                  era.latI2,
                  era.longI2,
                  era.latS2,
                  era.longS2
                )}
                pathOptions={{ color: "green", weight: 2, fillOpacity: 0.4 }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">{era.tipo}</h3>
                    <p className="text-sm font-medium mb-2">
                      Total cultivos: {plantaciones.length}
                    </p>
                    {/* Add max-height and overflow-y for scrolling */}
                    <div
                      className="space-y-2"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {plantaciones.map((plantacion) => {
                        const cultivo = plantacion.cultivo;
                        const semillero = plantacion.semillero;
                        return (
                          <div
                            key={`plantacion-${plantacion.id}`}
                            className="text-sm border-t pt-2"
                          >
                            <p>
                              <span className="font-medium">
                                {semillero ? "Semillero" : "Cultivo"}:
                              </span>{" "}
                              {semillero
                                ? semillero.cultivo?.nombre
                                : cultivo?.nombre || "Sin nombre"}
                            </p>
                            <p>
                              <span className="font-medium">Cantidad:</span>{" "}
                              {plantacion.unidades}
                            </p>
                            <p>
                              <span className="font-medium">
                                Fecha de siembra:
                              </span>{" "}
                              {plantacion.fechaSiembra
                                ? new Date(
                                    plantacion.fechaSiembra
                                  ).toLocaleDateString("es-CO")
                                : "N/A"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          }
        )}
    </MapContainer>
  );
};

export default MapComponent;

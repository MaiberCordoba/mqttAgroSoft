import { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Sprout, Calculator, ArrowLeft, Droplet, ChevronDown, ChevronUp } from "lucide-react";
import { addToast } from "@heroui/toast";
import EvapotranspiracionCard from "./EvapotranspiracionCard";
import EvapotranspiracionChart from "./EvapotranspiracionChart";
import CropKCoefficientTable from "./Kc";
import Recomendaciones from "./Recomendacion";
import { Cultivo, Eras, Semillero } from "@/modules/Trazabilidad/types";

type Plantacion = {
  id: number;
  fechaSiembra: string;
  fk_Cultivo: {
    id: string;
    nombre: string;
  };
  fk_Era: number;
  semillero: Semillero;
  cultivo: Cultivo;
  eras: Eras;
};

export default function EvapotranspiracionC() {
  const [evapotranspiracion, setEvapotranspiracion] = useState<any>(null);
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<number | string>("");
  const [errorET, setErrorET] = useState<string | null>(null);
  const [kcValue, setKcValue] = useState<string>("");
  const [showSensorList, setShowSensorList] = useState<boolean>(false);  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/plantaciones/');
        const plantacionesData = await response.json();
        setPlantaciones(plantacionesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        addToast({
          title: "Error",
          description: "Error al cargar los datos necesarios",
          variant: "flat",
          color: "danger",
        });
      }
    };
    fetchData();
  }, []);

  const calcularEvapotranspiracion = async () => {
    if (!selectedPlantacion) {
      setErrorET("Selecciona una plantación");
      addToast({
        title: "Error",
        description: "Debes seleccionar una plantación para calcular la evapotranspiración.",
        variant: "flat",
        color: "danger",
      });
      return;
    }

    try {
      const params = new URLSearchParams({
        plantacion_id: String(selectedPlantacion)
      });
      
      if (kcValue) params.append('kc', kcValue);

      const response = await fetch(`http://localhost:8000/api/evapotranspiracion/?${params}`);
      
      if (!response.ok) throw new Error("Error al calcular evapotranspiración");
      
      const data = await response.json();
      
      setEvapotranspiracion({
        ...data,
        fecha: data.fecha || new Date().toISOString()
      });
      
      setErrorET(null);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setErrorET(message);
      addToast({
        title: "Error",
        description: `Error al calcular: ${message}`,
        variant: "flat",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
        {!evapotranspiracion && (
          <div
            className="max-w-md mx-auto"
            style={{
              background: '#f0fdf4',
              borderRadius: '0.75rem',
              boxShadow: '0 6px 24px 0 rgba(16, 185, 129, 0.10)',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontWeight: 500,
              fontSize: 14,
              padding: 24,
            }}
          >
            <h2 className="text-2xl font-bold text-green-800 mb-8 flex items-center justify-center gap-2 text-center">
              <Calculator className="text-green-600 w-6 h-6 -mr-1" style={{ color: "#166534" }} />
              Calcular Evapotranspiración
            </h2>

            <div className="flex flex-col gap-4">
              <Select
                label="Seleccionar Plantación"
                placeholder="Selecciona una plantación"
                selectedKeys={selectedPlantacion ? [String(selectedPlantacion)] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedPlantacion(selected);
                  setErrorET(null);
                }}
                className={`w-full ${errorET ? "border border-red-500" : ""}`}
                errorMessage={errorET}
                color={errorET ? "danger" : undefined}
              >
                {plantaciones.map((plantacion) => {
                  const cultivo = plantacion.cultivo?.nombre || plantacion.semillero?.cultivo?.nombre || 'N/D';
                  const era = plantacion.eras?.tipo || 'N/D';
                  const dias = plantacion.fechaSiembra
                    ? Math.floor(
                        (Date.now() - new Date(plantacion.fechaSiembra).getTime()) / (1000 * 60 * 60 * 24)
                      )
                    : 'N/D';

                  return (
                    <SelectItem key={String(plantacion.id)} textValue={`Cultivo ${cultivo}`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Cultivo: {cultivo}</span>
                        <span className="text-xs text-gray-500">Era: {era}</span>
                        <span className="text-xs text-gray-500">Días sembrados: {dias}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </Select>

              <Input
                label="Coeficiente de Cultivo (Kc - Opcional)"
                placeholder="Dejar vacío para cálculo automático"
                type="number"
                min="0"
                step="0.01"
                value={kcValue}
                onChange={(e) => setKcValue(e.target.value)}
                description="Valor numérico que representa el coeficiente del cultivo"
                className="w-full"
              />

              <div className="flex justify-end gap-4">
                <Button 
                  color="success" 
                  onClick={calcularEvapotranspiracion}
                  disabled={!selectedPlantacion}
                  className="w-full sm:w-auto"
                >
                  Calcular
                </Button>
              </div>
            </div>
          </div>
        )}

        {evapotranspiracion && (
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setEvapotranspiracion(null)}
                className="p-0 m-0 bg-transparent border-none outline-none hover:bg-transparent focus:ring-0"
                style={{ lineHeight: 0 }}
                aria-label="Volver"
                type="button"
              >
                <ArrowLeft className="h-6 w-6 text-blue-700" strokeWidth={2} style={{ color: "#2ECC71" }} />
              </button>
              <h2 className="text-2xl font-bold text-blue-800 text-center">
                <strong>Evapotranspiración (ETc)</strong>
              </h2>
              <div className="w-10"/>
            </div>
            <div className="h-10" />
            <div 
              className="grid gap-6" 
              style={{ 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                minHeight: '500px'
              }}
            >
              
              <div className="space-y-6 min-w-0">
                <div
                  className="rounded-2xl shadow-md w-full max-w-md flex flex-col justify-between mx-auto"
                  style={{
                    background: 'rgba(224, 242, 254, 0.35)', 
                    borderRadius: '0.75rem',
                    boxShadow: '0 6px 24px 0 rgba(16, 185, 129, 0.10)',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontWeight: 500,
                    fontSize: 14,
                    padding: 24,
                  }}
                >
                  <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                    <Sprout className="text-green-700" size={20} style={{ color: "#2ECC71" }} />
                    Detalles de la Plantación
                  </h3>
                  <br/>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-black">Cultivo:</span>
                      <span className="text-black">{evapotranspiracion.detalles.cultivo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-black">Lote:</span>
                      <span className="text-black">{evapotranspiracion.detalles.lote}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-black">Fecha Siembra:</span>
                      <span className="text-black">{new Date(evapotranspiracion.detalles.fecha_siembra).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-black">Días desde siembra:</span>
                      <span className="text-black">{evapotranspiracion.detalles.dias_siembra}</span>
                    </div>

                    {evapotranspiracion.sensor_data.humedad_suelo && (
                      <div className="pt-3 mt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Droplet className="text-purple-600" size={18} />
                            <span className="font-medium text-black">Humedad del Suelo:</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-black">
                              {evapotranspiracion.sensor_data.humedad_suelo}%
                            </span>
                            {evapotranspiracion.alerta_humedad && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                evapotranspiracion.alerta_humedad.tipo === 'peligro' 
                                  ? 'bg-red-100 text-red-800' 
                                  : evapotranspiracion.alerta_humedad.tipo === 'advertencia' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                              }`}>
                                {evapotranspiracion.alerta_humedad.tipo === 'peligro' 
                                  ? 'Crítica' 
                                  : evapotranspiracion.alerta_humedad.tipo === 'advertencia' 
                                    ? 'Alta'
                                    : 'Óptima'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-6" />

                {/* Card de Evapotranspiración */}
                <div >
                  <EvapotranspiracionCard
                    etReal={evapotranspiracion.evapotranspiracion_mm_dia}
                    kc={evapotranspiracion.kc}
                    detalles={{
                      temperatura: evapotranspiracion.sensor_data.temperatura,
                      viento: evapotranspiracion.sensor_data.viento,
                      iluminacion: evapotranspiracion.sensor_data.iluminacion,
                      humedad_ambiente: evapotranspiracion.sensor_data.humedad_aire,
                      humedad_suelo: evapotranspiracion.sensor_data.humedad_suelo
                    }}
                    estadoHumedad={evapotranspiracion.alerta_humedad?.tipo}
                  />
                </div>
              </div>

              {/* COLUMNA DERECHA - Gráficos y recomendaciones */}
              <div className="space-y-6 min-w-0">
                {/* Gráfico de Evapotranspiración */}
                <div >
                  <EvapotranspiracionChart 
                    plantacionId={selectedPlantacion.toString()}
                    nuevoDato={{
                      fecha: new Date().toISOString(),
                      et_mm_dia: evapotranspiracion.evapotranspiracion_mm_dia,
                      kc: evapotranspiracion.kc,
                      temperatura: evapotranspiracion.sensor_data.temperatura,
                      humedad_ambiente: evapotranspiracion.sensor_data.humedad_aire,
                      humedad_suelo: evapotranspiracion.sensor_data.humedad_suelo,
                      estado_humedad: evapotranspiracion.alerta_humedad?.tipo,
                      dias_desde_siembra: evapotranspiracion.detalles.dias_siembra
                    }}
                    showAdditionalInfo={true}
                  />
                </div>
                    <div className="h-6" />
                {/* Recomendaciones */}
                <div >
                  <Recomendaciones 
                    cultivo={{
                      id: selectedPlantacion.toString(),
                      nombre: evapotranspiracion.detalles.cultivo,
                      dias_siembra: evapotranspiracion.detalles.dias_siembra
                    }}
                    datosActuales={{
                      et: evapotranspiracion.evapotranspiracion_mm_dia,
                      kc: evapotranspiracion.kc,
                      temperatura: evapotranspiracion.sensor_data.temperatura,
                      humedad_suelo: evapotranspiracion.sensor_data.humedad_suelo,
                      humedad_ambiente: evapotranspiracion.sensor_data.humedad_aire,
                      estado_humedad: evapotranspiracion.alerta_humedad?.tipo || 'normal'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <br/><br/><br/>
        {!evapotranspiracion && (
          <div className="col-span-full mt-6 flex flex-col items-center w-full max-w-3xl mx-auto">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-all text-sm"
              onClick={() => setShowSensorList((prev) => !prev)}
            >
              {showSensorList ? (
                <>
                  Ocultar lista <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  coeficientes Kc recomendados <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            
            {showSensorList && (
              <div className="w-full mt-4 animate-slideDown">
                <CropKCoefficientTable />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
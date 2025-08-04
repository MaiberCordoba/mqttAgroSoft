import {
  WiStrongWind,
  WiThermometer,
  WiDaySunny,
  WiHumidity,
  WiRaindrop
} from "react-icons/wi";

interface Props {
  etReal: number;
  kc: number;
  detalles: {
    temperatura: number;
    viento: number;
    iluminacion: number;
    humedad_ambiente: number;
    humedad_suelo?: number;
  };
  estadoHumedad?: 'bajo' | 'optimo' | 'alto'; 
}

export default function EvapotranspiracionCard({ etReal, kc, detalles, estadoHumedad }: Props) {
  const getHumedadInfo = () => {
    if (!detalles.humedad_suelo) return { color: "text-gray-500", text: "Sin datos" };
    
    switch (estadoHumedad) {
      case 'bajo': return { color: "text-red-500", text: "Baja" };
      case 'alto': return { color: "text-blue-500", text: "Alta" };
      case 'optimo': return { color: "text-green-500", text: "Óptima" };
      default: return { color: "text-gray-600", text: "Normal" };
    }
  };
  
  const humedadInfo = getHumedadInfo();

  return (
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
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-center text-green-800 mb-4">
            Evapotranspiración Real (ETc)
          </h3>
          <img
            src="/AGROPECUARIAS_Agronomia.png"
            alt="evapotranspiracion"
            className="w-12 h-12 grayscale brightness-90 opacity-80"
          />
        </div>
        
        <div className="mb-4">
          <p className="text-2xl font-bold text-blue-600">
            {etReal.toFixed(2)} mm/día
          </p>
          <p className="text-sm text-gray-500">
            Coeficiente de cultivo (Kc): {kc.toFixed(2)}
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Datos Meteorológicos:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <WiThermometer size={24} className="text-red-500" />
              <div>
                <span className="block text-sm text-gray-600">Temperatura</span>
                <span className="font-medium">{detalles.temperatura} °C</span>
              </div>
            </li>
            
            <li className="flex items-center gap-3">
              <WiStrongWind size={24} style={{ color: "#5DADE2" }} />
              <div>
                <span className="block text-sm text-gray-600" >Viento</span>
                <span className="font-medium">
                  {detalles.viento} km/h
                </span>
              </div>
            </li>
            
            <li className="flex items-center gap-3">
              <WiDaySunny size={24} className="text-yellow-500" style={{ color: "#F1C40F" }} />
              <div>
                <span className="block text-sm text-gray-600">Iluminación</span>
                <span className="font-medium">
                  {detalles.iluminacion} lux
                </span>
              </div>
            </li>
            
            <li className="flex items-center gap-3">
              <WiHumidity size={24} className="text-cyan-500" style={{ color: "#76D7C4" }}/>
              <div>
                <span className="block text-sm text-gray-600">Humedad Ambiente</span>
                <span className="font-medium">
                  {detalles.humedad_ambiente}%
                </span>
              </div>
            </li>
            
            <li className="flex items-center gap-3">
              <WiRaindrop size={28} className="text-indigo-500" style={{ color: "#3498DB" }}/>
              <div>
                <span className="block text-sm text-gray-600">Humedad del Suelo</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {detalles.humedad_suelo ? `${detalles.humedad_suelo}%` : "N/A"}
                  </span>
                  {detalles.humedad_suelo && (
                    <span className={`text-xs px-2 py-1 rounded-full ${humedadInfo.color}`}>
                      {humedadInfo.text}
                    </span>
                  )}
                </div>
              </div>
            </li>

          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          * Valores calculados en base a los últimos 24 horas
        </p>
      </div>
    </div>
  );
}
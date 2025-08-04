import { useState, useCallback, useEffect, useRef } from "react";
import { Header } from "../components/mqtt/Header";
import { SensorCards } from "../components/mqtt/SensorCards";
import { LineChart } from "../components/mqtt/LineChart";
import { Sonido } from "../components/mqtt/SonidoChart";
import { Button } from "@heroui/react";
import { ReportPDF, ReportPDFRef } from "../components/mqtt/ReportDownload";

export interface SensorData {
  temp: string;
  humidity: string;
  luminosity: string;
  soilMoisture: string;
  sound: string;
  timestamp: number;
}

const INACTIVITY_THRESHOLD = 10000;

export const Mqtt = () => {
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [dataAlert, setDataAlert] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Nuevo estado para controlar la generación
  const lastUpdateRef = useRef<number>(Date.now());
  const reportRef = useRef<ReportPDFRef>(null); // Ref para el componente ReportPDF
  
  const updateHistory = useCallback((newData: {
    temp: string;
    humidity: string;
    luminosity: string;
    soilMoisture: string; 
    sound: string;        
  }) => {
    lastUpdateRef.current = Date.now();
    setDataAlert(false);
    
    setHistoricalData(prev => {
      const newPoint = {
        ...newData,
        timestamp: Date.now()
      };
      return [...prev, newPoint].slice(-50);
    });
  }, []);

  useEffect(() => {
    const checkInactivity = () => {
      const elapsed = Date.now() - lastUpdateRef.current;
      setDataAlert(elapsed > INACTIVITY_THRESHOLD);
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para manejar la generación del reporte
  const handleGenerateReport = async () => {
    if (!reportRef.current || historicalData.length === 0) return;
    
    try {
      setIsGenerating(true);
      await reportRef.current.generateReport();
    } catch (error) {
      console.error("Error generando reporte:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      
      {dataAlert && (
        <div className="data-alert bg-red-100 text-red-700 p-3 rounded text-center mb-4">
           ¡Alerta! No se están recibiendo datos de los sensores
        </div>
      )}
      
      <SensorCards onUpdate={updateHistory} />
      
      <div className="chart-container mb-6">
        <LineChart data={historicalData} />
      </div>
      
      <div className="chart-container mb-8">
        <Sonido data={historicalData} />
      </div>

      <div className="flex justify-center mb-10">
        <Button 
          color="success" 
          onClick={handleGenerateReport}
          className="px-6 py-3 text-lg"
          isLoading={isGenerating}
          disabled={historicalData.length === 0 || isGenerating}
        >
          {isGenerating ? "Generando PDF..." : "Generar Reporte PDF"}
        </Button>
      </div>
      
      {/* Componente de generación de PDF (oculto) */}
      <ReportPDF 
        ref={reportRef} 
        historicalData={historicalData} 
        
      />
    </div>
  );
};
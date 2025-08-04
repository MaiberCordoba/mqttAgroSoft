import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem, Chip } from "@heroui/react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { ArrowLeft } from "lucide-react";

export interface SensorData {
  id?: number;
  fk_lote?: number | null;
  fk_eras?: number | null;
  fecha: string;
  tipo: "TEM" | "LUM" | "HUM_A" | "VIE" | "HUM_T" | "PH" | "LLUVIA";
  valor: number;
  umbral_minimo?: number | null;
  umbral_maximo?: number | null;
}

export const SENSOR_TYPES = [
  { key: "TEM", label: "Temperatura" },
  { key: "LUM", label: "Iluminación" },
  { key: "HUM_A", label: "Humedad Ambiental" },
  { key: "VIE", label: "Velocidad del Viento" },
  { key: "HUM_T", label: "Humedad del Terreno" },
  { key: "PH", label: "Nivel de PH" },
  { key: "LLUVIA", label: "Lluvia" }
];

export interface SensorConExtras extends SensorData {
  unidad: string;
  alerta: boolean;
}

const SENSOR_COLORS: Record<string, string> = {
  TEM: "#16a34a",      // Verde vivo (Temperatura)
  LUM: "#facc15",      // Amarillo brillante (Iluminación)
  HUM_A: "#0ea5e9",    // Azul celeste (Humedad Ambiental)
  VIE: "#f43f5e",      // Rojo vibrante (Viento)
  HUM_T: "#22d3ee",    // Cyan claro (Humedad Terreno)
  PH: "#a21caf",       // Morado intenso (PH)
  LLUVIA: "#2563eb"    // Azul fuerte (Lluvia)
};

const SENSOR_UNITS: Record<string, string> = {
  TEM: "°C",
  LUM: "lux",
  HUM_A: "%",
  VIE: "km/h",
  HUM_T: "%",
  PH: "pH",
  LLUVIA: "mm"
};

const LOTES_ONLY = ["TEM", "LUM", "HUM_A", "VIE", "LLUVIA"];
const ERAS_ONLY = ["HUM_T", "PH"];

function dict(sensorTypes: {key: string, label: string}[]): Map<string, string> {
  const map = new Map();
  sensorTypes.forEach(type => map.set(type.key, type.label));
  return map;
}

const formatDateTimeForDisplay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatNumber = (value: unknown): string => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (typeof value === 'string' && !isNaN(Number(value))) {
    return Number(value).toFixed(2);
  }
  return 'N/A';
};

export default function AllSensorsDashboard() {
  const navigate = useNavigate();
  const [allSensorsData, setAllSensorsData] = useState<SensorConExtras[]>(() => {
    const savedData = localStorage.getItem('sensorData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [realTimeData, setRealTimeData] = useState<SensorConExtras[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Cambiado a array para múltiples selecciones
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [selectedEras, setSelectedEras] = useState<number[]>([]);
  const [availableLotes, setAvailableLotes] = useState<{id: number, nombre: string}[]>([]);
  const [availableEras, setAvailableEras] = useState<{id: number, nombre: string, fk_lote_id: number}[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const sensorsResponse = await fetch("http://127.0.0.1:8000/api/sensor/?limit=100");
        if (!sensorsResponse.ok) throw new Error("Error al obtener sensores");
        const sensorsData: SensorData[] = await sensorsResponse.json();

        if (Array.isArray(sensorsData)) {
          const enrichedData = sensorsData.map(item => ({
            ...item,
            unidad: SENSOR_UNITS[item.tipo],
            alerta: checkForAlerts(item)
          }));
          setAllSensorsData(enrichedData);
          localStorage.setItem('sensorData', JSON.stringify(enrichedData));

          const [lotesResponse, erasResponse] = await Promise.all([
            fetch("http://127.0.0.1:8000/api/lote/"),
            fetch("http://127.0.0.1:8000/api/eras/")
          ]);

          if (!lotesResponse.ok || !erasResponse.ok) {
            throw new Error("Error al obtener datos de ubicación");
          }

          const lotesData = await lotesResponse.json();
          const erasData = await erasResponse.json();

          setAvailableLotes(lotesData);
          setAvailableEras(erasData.map((era: any) => ({
            id: era.id,
            nombre: era.nombre,
            fk_lote_id: era.fk_lote_id
          })));
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('sensorData', JSON.stringify(allSensorsData));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [allSensorsData]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/sensor/");

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "sensor.update" || message.type === "sensor.global_update") {
          const sensorData = message.message;
          const enrichedData: SensorConExtras = {
            id: sensorData.sensor_id,
            tipo: sensorData.sensor_type,
            valor: sensorData.value,
            fecha: sensorData.timestamp,
            fk_lote: sensorData.location?.lote_id || null,
            fk_eras: sensorData.location?.era_id || null,
            umbral_minimo: sensorData.thresholds?.min || null,
            umbral_maximo: sensorData.thresholds?.max || null,
            unidad: SENSOR_UNITS[sensorData.sensor_type],
            alerta: message.type === "sensor.update" ? message.message.alert : message.is_alert
          };

          setRealTimeData(prev => {
            const newData = [...prev, enrichedData]
              .filter((item, index, self) => 
                index === self.findIndex(t => 
                  t.id === item.id && t.fecha === item.fecha
                )
              );
            return newData.slice(-100);
          });
        }
      } catch (error) {
        console.error("Error al procesar datos del WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Error de WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const combinedData = useMemo(() => {
    return [...allSensorsData, ...realTimeData];
  }, [allSensorsData, realTimeData]);

  const checkForAlerts = (sensor: SensorData): boolean => {
    if (sensor.umbral_minimo !== null && sensor.umbral_maximo !== null) {
      return (
        sensor.umbral_minimo !== undefined &&
        sensor.umbral_maximo !== undefined &&
        (sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo)
      );
    }
    return false;
  };

  const getLocationName = (sensor: SensorConExtras): string => {
    if (sensor.fk_lote) {
      const lote = availableLotes.find(l => l.id === sensor.fk_lote);
      return lote ? `Lote ${lote.nombre}` : `Lote ID:${sensor.fk_lote}`;
    }
    if (sensor.fk_eras) {
      const era = availableEras.find(e => e.id === sensor.fk_eras);
      if (era) {
        const lote = availableLotes.find(l => l.id === era.fk_lote_id);
        return `Era ${era.id}${lote ? ` (Lote ${lote.nombre})` : ''}`;
      }
      return `Era ID:${sensor.fk_eras}`;
    }
    return "Sin ubicación";
  };

  const filteredSensors = useMemo(() => {
    return combinedData.filter(sensor => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(sensor.tipo);
            const sensorMatch = selectedSensors.length === 0 || 
        (sensor.id && selectedSensors.includes(sensor.id.toString()));
      
      let loteMatch = true;
      if (selectedLotes.length > 0) {
        if (LOTES_ONLY.includes(sensor.tipo)) {
          loteMatch = sensor.fk_lote !== null && sensor.fk_lote !== undefined && selectedLotes.includes(sensor.fk_lote);
        } else if (ERAS_ONLY.includes(sensor.tipo)) {
          const era = availableEras.find(e => e.id === sensor.fk_eras);
          loteMatch = era !== undefined && selectedLotes.includes(era.fk_lote_id);
        } else {
          loteMatch = false;
        }
      }
      
      let eraMatch = true;
      if (selectedEras.length > 0) {
        if (ERAS_ONLY.includes(sensor.tipo)) {
          eraMatch = sensor.fk_eras !== null && sensor.fk_eras !== undefined && selectedEras.includes(sensor.fk_eras);
        } else {
          eraMatch = false;
        }
      }
      
      return typeMatch && sensorMatch && loteMatch && eraMatch;
    });
  }, [combinedData, selectedTypes, selectedSensors, selectedLotes, selectedEras, availableEras]);

  const prepareChartData = useMemo(() => {
    const sensorGroups = new Map<string, SensorConExtras[]>();
    
    filteredSensors.forEach(sensor => {
      if (!sensor.id) return;
      
      const sensorId = sensor.id.toString();
      if (!sensorGroups.has(sensorId)) {
        sensorGroups.set(sensorId, []);
      }
      sensorGroups.get(sensorId)?.push(sensor);
    });
    
    // Ordenar cada grupo por fecha
    sensorGroups.forEach((values) => {
      values.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    });
    
    // Crear estructura para el gráfico
    const chartData: any[] = [];
    
    // Para cada sensor, agregar sus puntos al gráfico
    sensorGroups.forEach((sensorReadings, sensorId) => {
      const sensorType = sensorReadings[0]?.tipo;
      const color = SENSOR_COLORS[sensorType] || '#8884d8';
      const unit = SENSOR_UNITS[sensorType] || '';
      
      sensorReadings.forEach(reading => {
        const timeKey = new Date(reading.fecha).toISOString();
        
        let dataPoint = chartData.find(point => point.timestamp === timeKey);
        
        if (!dataPoint) {
          dataPoint = { 
            timestamp: timeKey,
            formattedTime: new Date(reading.fecha).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          };
          chartData.push(dataPoint);
        }
        
        dataPoint[`${sensorId}_valor`] = reading.valor;
        dataPoint[`${sensorId}_color`] = color;
        dataPoint[`${sensorId}_unit`] = unit;
        dataPoint[`${sensorId}_type`] = sensorType;
      });
    });
    
    chartData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return chartData;
  }, [filteredSensors]);

  // Renderizar líneas del gráfico
  const renderChartLines = useMemo(() => {
    const uniqueSensorIds = new Set(
      filteredSensors.map(sensor => sensor.id?.toString()).filter(Boolean)
    );
    
    return Array.from(uniqueSensorIds).map(sensorId => {
      const sensor = filteredSensors.find(s => s.id?.toString() === sensorId);
      if (!sensor) return null;
      
      return (
        <Line
          key={sensorId}
          type="monotone"
          dataKey={`${sensorId}_valor`}
          stroke={SENSOR_COLORS[sensor.tipo] || '#8884d8'}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name={sensorId}
          isAnimationActive={true}
          connectNulls={true}
        />
      );
    }).filter(Boolean);
  }, [filteredSensors]);

  const linesToShow = useMemo(() => {
    const uniqueSensors = new Map<string, {
      id: string,
      type: string,
      location: string,
      color: string,
      unit: string
    }>();

    filteredSensors.forEach(sensor => {
      if (sensor.id) {
        const sensorId = sensor.id.toString();
        if (!uniqueSensors.has(sensorId)) {
          uniqueSensors.set(sensorId, {
            id: sensorId,
            type: sensor.tipo,
            location: getLocationName(sensor),
            color: SENSOR_COLORS[sensor.tipo],
            unit: SENSOR_UNITS[sensor.tipo]
          });
        }
      }
    });

    return Array.from(uniqueSensors.values());
  }, [filteredSensors]);

  const generatePDFReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const margin = 15;
      let yPosition = margin;

      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > 280) {
          doc.addPage();
          yPosition = margin;
        }
      };

      const addHeader = () => {
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Sensores Agrícolas", 105, yPosition, { align: "center" });
        yPosition += 10;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generado el: ${formatDateTimeForDisplay(new Date())}`, 105, yPosition, { align: "center" });
        yPosition += 15;
      };

      addHeader();

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Filtros aplicados", margin, yPosition);
      yPosition += 8;

      let filtersText = "• Todos los sensores";
      if (selectedTypes.length > 0) {
        filtersText += `\n• Tipos: ${selectedTypes.map(type => 
          dict(SENSOR_TYPES).get(type)
        ).join(", ")}`;
      }
      if (selectedLotes.length > 0) {
        filtersText += `\n• Lotes: ${selectedLotes.map(id => {
          const lote = availableLotes.find(l => l.id === id);
          return lote ? lote.nombre : `ID ${id}`;
        }).join(", ")}`;
      }
      if (selectedEras.length > 0) {
        filtersText += `\n• Eras: ${selectedEras.map(id => {
          const era = availableEras.find(e => e.id === id);
          return era ? era.nombre : `ID ${id}`;
        }).join(", ")}`;
      }

      const splitText = doc.splitTextToSize(filtersText, 180);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(splitText, margin, yPosition);
      yPosition += splitText.length * 5 + 15;

      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Datos de Sensores", margin, yPosition);
      yPosition += 10;

      if (filteredSensors.length === 0) {
        doc.setFontSize(12);
        doc.text("No hay datos de sensores para los filtros seleccionados", margin, yPosition);
        yPosition += 10;
      } else {
        const tableData = filteredSensors.map(sensor => [
          sensor.id?.toString() || 'N/A',
          dict(SENSOR_TYPES).get(sensor.tipo) || sensor.tipo,
          `${formatNumber(sensor.valor)} ${sensor.unidad}`,
          sensor.umbral_minimo !== null ? `${formatNumber(sensor.umbral_minimo)} ${sensor.unidad}` : 'N/A',
          sensor.umbral_maximo !== null ? `${formatNumber(sensor.umbral_maximo)} ${sensor.unidad}` : 'N/A',
          formatDateTimeForDisplay(sensor.fecha),
          getLocationName(sensor),
          sensor.alerta ? 'Sí' : 'No'
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['ID', 'Tipo', 'Valor', 'Umbral Mín', 'Umbral Máx', 'Fecha', 'Ubicación', 'Alerta']],
          body: tableData,
          margin: { left: margin, right: margin },
          styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [46, 204, 113],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          didDrawPage: (data) => {
            yPosition = data.cursor.y + 10;
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      if (filteredSensors.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Gráficas de Datos", margin, yPosition);
        yPosition += 10;

        const chartElement = document.querySelector('.recharts-wrapper');
        if (chartElement) {
          try {
            const canvas = await html2canvas(chartElement as HTMLElement);
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            checkPageBreak(imgHeight + 10);
            doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error("Error al generar gráfica:", error);
            doc.setFontSize(10);
            doc.text("No se pudo incluir la gráfica en el reporte", margin, yPosition);
            yPosition += 10;
          }
        }
      }

      const alertas = filteredSensors.filter(sensor => sensor.alerta);
      if (alertas.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Alertas (${alertas.length})`, margin, yPosition);
        yPosition += 10;

        const alertTableData = alertas.map(alert => [
          alert.id?.toString() || 'N/A',
          dict(SENSOR_TYPES).get(alert.tipo) || alert.tipo,
          `${formatNumber(alert.valor)} ${alert.unidad}`,
          `${alert.umbral_minimo !== null ? formatNumber(alert.umbral_minimo) : 'N/A'} - ${alert.umbral_maximo !== null ? formatNumber(alert.umbral_maximo) : 'N/A'} ${alert.unidad}`,
          formatDateTimeForDisplay(alert.fecha),
          getLocationName(alert)
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['ID', 'Tipo', 'Valor', 'Rango Normal', 'Fecha', 'Ubicación']],
          body: alertTableData,
          margin: { left: margin, right: margin },
          styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [231, 76, 60],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          didDrawPage: (data) => {
            yPosition = data.cursor.y + 10;
          }
        });
      }

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${totalPages}`,
          105,
          287,
          { align: "center" }
        );
        doc.text(
          "© Sistema de Monitoreo Agrícola",
          195,
          287,
          { align: "right" }
        );
      }

      const fileName = `Reporte_Sensores_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Ocurrió un error al generar el reporte");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="light"
          color="success" 
          onClick={() => navigate(-1)}
          isIconOnly
          className="mr-2"
        >
          <ArrowLeft size={22} />
        </Button>
        
        <Button 
          color="success" 
          onClick={generatePDFReport}
          isDisabled={isLoading || isGeneratingReport}
          isLoading={isGeneratingReport}
          startContent={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 16v-8M8 12l4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" strokeWidth="2"/>
        </svg>
          }
        >
          Generar Reporte PDF
        </Button>
      </div>
      <div className="h-8" />


      <h1 className="text-2xl font-bold text-center mb-6 font-extrabold">
        <strong>Todos los Sensores</strong>
      </h1>

      <div className="h-8" />

      <div className="col-span-full flex flex-row gap-4 w-full max-w-3xl mx-auto px-4 items-center justify-center mb-6">
        <Select
          label=""
          placeholder="Tipo de sensor"
          selectionMode="multiple"
          selectedKeys={selectedTypes}
          onSelectionChange={(keys) => {
        setSelectedTypes(Array.from(keys) as string[]);
        setSelectedSensors([]);
          }}
          size="md"
          className="min-w-[180px] text-base"
        >
          {SENSOR_TYPES.map(type => (
        <SelectItem key={type.key} className="text-base truncate">
          {type.label}
        </SelectItem>
          ))}
        </Select>

        {selectedTypes.length > 0 && (
          <Select
            label=""
            placeholder={`Sensores seleccionados`}
            selectionMode="multiple"
            selectedKeys={selectedSensors}
            onSelectionChange={(keys) => setSelectedSensors(Array.from(keys) as string[])}
            size="md"
            className="min-w-[200px] text-base"
          >
            {Array.from(new Map(
              combinedData
                .filter(sensor => selectedTypes.includes(sensor.tipo))
                .filter(sensor => sensor.id !== undefined)
                .map(sensor => [sensor.id, sensor])
            ).values()).map(sensor => (
              <SelectItem 
                key={sensor.id.toString()}
                className="text-base truncate"
              >
                {`${dict(SENSOR_TYPES).get(sensor.tipo)} - ${getLocationName(sensor)}`}
              </SelectItem>
            ))}
          </Select>
        )}

        <Select
          label=""
          placeholder="Filtrar por lote"
          selectionMode="multiple"
          selectedKeys={selectedLotes.map(String)}
          onSelectionChange={(keys) => setSelectedLotes(Array.from(keys).map(Number))}
          size="md"
          className="min-w-[180px] text-base"
        >
          {availableLotes.map(lote => (
            <SelectItem key={String(lote.id)} className="text-base truncate">
              {lote.nombre}
            </SelectItem>
          ))}
        </Select>

        <Select
          label=""
          placeholder="Filtrar por era"
          selectionMode="multiple"
          selectedKeys={selectedEras.map(String)}
          onSelectionChange={(keys) => setSelectedEras(Array.from(keys).map(Number))}
          size="md"
          className="min-w-[150px] text-base"
        >
          {availableEras.map(era => (
            <SelectItem key={String(era.id)} className="text-base truncate">
              Era {era.id || `Era ${era.id}`}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="h-8" />
      <div  className="flex flex-col p-3 border border-red-700 rounded-xl bg-red-200 hover:bg-red-300 transition-all shadow-md">
        <h2 className="text-xl font-bold mb-6 text-green-800 flex items-center gap-2">
          Datos de Sensores
        </h2>
          <div className="h-4" />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {linesToShow.map((line, index) => (
                <Chip 
                  key={index}
                  color="primary"
                  variant="dot"
                  style={{ backgroundColor: line.color, color: "#fff", fontWeight: 600, borderRadius: 8 }}
                  className="shadow-sm px-3 py-1"
                >
                  {dict(SENSOR_TYPES).get(line.type)} - {line.location}
                </Chip>
              ))}
            </div>
            <div className="h-4" />

            <div className="rounded-xl bg-white shadow-inner p-4 border border-gray-100">
              <ResponsiveContainer width="100%" height={420}>
                <LineChart 
                  data={prepareChartData}
                  margin={{ top: 30, right: 40, left: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e0f2fe" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="#f0fdf4" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="url(#colorGrid)" strokeDasharray="4 4" vertical={false} />
                  <XAxis 
                    dataKey="formattedTime" 
                    tick={{ fill: '#4b5563', fontWeight: 500, fontSize: 13 }}
                    tickMargin={12}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: "#a7f3d0" }}
                    tickLine={{ stroke: "#a7f3d0" }}
                  />
                  <YAxis 
                    tick={{ fill: '#4b5563', fontWeight: 500, fontSize: 13 }}
                    tickMargin={12}
                    axisLine={{ stroke: "#a7f3d0" }}
                    tickLine={{ stroke: "#a7f3d0" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'linear-gradient(135deg, #f0fdf4 60%, #e0f2fe 100%)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 6px 24px 0 rgba(16, 185, 129, 0.10)',
                      border: '1px solid #bbf7d0',
                      color: '#166534',
                      fontWeight: 500,
                      fontSize: 14,
                      padding: 12
                    }}
                    formatter={(value: number, name: string, props: any) => {
                      const sensorId = name.split('_')[0];
                      const unit = props.payload[`${sensorId}_unit`] || '';
                      const type = props.payload[`${sensorId}_type`] || '';
                      return [`${value} ${unit}`, `${dict(SENSOR_TYPES).get(type)}`];
                    }}
                    labelFormatter={(label) => `Hora: ${label}`}
                  />
                  <Legend 
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: 12,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#166534"
                    }}
                    formatter={(value) => {
                      const sensorId = value;
                      const sensor = filteredSensors.find(s => s.id?.toString() === sensorId);
                      if (!sensor) return value;
                      return `${dict(SENSOR_TYPES).get(sensor.tipo)} - ${getLocationName(sensor)}`;
                    }}
                  />
                  {renderChartLines}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
      <div className="h-8" />
      <div className="flex flex-col p-3 border rounded-xl bg-red-200 hover:bg-red-300 transition-all shadow-md">
        <h2 className="text-xl font-bold mb-5 text-red-900 flex items-center gap-2">
          <svg width="22" height="22" fill="none" className="inline-block text-red-700">
            <circle cx="11" cy="11" r="10" stroke="#b91c1c" strokeWidth="2" fill="#fee2e2"/>
            <rect x="10" y="6" width="2" height="6" rx="1" fill="#b91c1c"/>
            <circle cx="11" cy="15" r="1.2" fill="#b91c1c"/>
          </svg>
          Alertas Recientes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSensors
            .filter(sensor => sensor.alerta)
            .slice(0, 5)
            .map((sensor, index) => (
              <div
                key={index}
                className="flex flex-col p-3 border border-red-700 rounded-xl bg-red-200 hover:bg-red-300 transition-all shadow-md"
              >
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-red-900">
                      {dict(SENSOR_TYPES).get(sensor.tipo)}
                    </span>
                    <Chip 
                      color="danger" 
                      size="sm" 
                      className="uppercase tracking-wide text-xs bg-red-700 text-white border border-red-900 font-bold"
                      style={{ backgroundColor: "#b91c1c ", color: "#fff" }}
                    >
                      Alerta
                    </Chip>
                  </div>
                  
                  <div className="text-red-800 text-xs font-semibold">
                    <span className="font-medium">Ubicación:</span> {getLocationName(sensor)}
                  </div>
                  
                  <div className="flex justify-between items-end mt-1.5">
                    <div className="flex flex-col gap-1 text-xs text-red-800 font-semibold">
                      <span>ID: {sensor.id}</span>
                      <span>{formatDateTimeForDisplay(sensor.fecha)}</span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span
                        className="text-2xl font-extrabold leading-none drop-shadow"
                        style={{ color: "#b91c1c" }}
                      >
                        {formatNumber(sensor.valor)}
                        <span className="text-base font-bold ml-0.5">{sensor.unidad}</span>
                      </span>
                      {sensor.umbral_minimo !== null && sensor.umbral_maximo !== null && (
                        <span className="text-xs font-semibold mt-0.5" style={{ color: "#b91c1c" }}>
                          Rango: {formatNumber(sensor.umbral_minimo)}-{formatNumber(sensor.umbral_maximo)} {sensor.unidad}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
          {filteredSensors.filter(sensor => sensor.alerta).length === 0 && (
            <div className="md:col-span-2 flex items-center justify-center p-6 bg-red-100 rounded-lg shadow-md">
              <p className="text-red-800 font-semibold text-lg">No hay alertas recientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
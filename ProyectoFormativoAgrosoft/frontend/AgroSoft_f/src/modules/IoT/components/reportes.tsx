import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { SENSOR_TYPES, SENSOR_UNITS } from "../types/sensorTypes";
import { ensureDate, formatDateForDisplay, formatDateTimeForDisplay } from "./dateUtils";

interface ReportOptions {
  sensorTypes?: string[];
  loteId?: number;
  eraId?: number;
  cultivoId?: number;
  timeRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
  includeAlerts?: boolean;
  includeET?: boolean;
}

interface SensorData {
  id: number;
  tipo: string;
  valor: number;
  umbral_minimo: number | null;
  umbral_maximo: number | null;
  fecha: string;
  fk_lote_id: number | null;
  fk_eras_id: number | null;
  lote_nombre?: string;
  era_nombre?: string;
}

interface ETData {
  fecha: string;
  et_mm_dia: number;
}

export async function generateSensorReport(options: ReportOptions) {
  // Validar y normalizar las fechas primero
  if (options.timeRange) {
    try {
      options.timeRange.start = ensureDate(options.timeRange.start);
      options.timeRange.end = ensureDate(options.timeRange.end);
      
      if (options.timeRange.start > options.timeRange.end) {
        [options.timeRange.start, options.timeRange.end] = 
          [options.timeRange.end, options.timeRange.start];
      }
    } catch (error) {
      console.error("Error en el rango de fechas:", error);
      return false;
    }
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const margin = 15;
  let yPosition = margin;
  let pageNumber = 1;

  // Función para obtener nombres de ubicaciones
  const fetchLocationNames = async () => {
    try {
      const [lotesResponse, erasResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/lote/"),
        fetch("http://127.0.0.1:8000/api/eras/")
      ]);

      if (!lotesResponse.ok || !erasResponse.ok) {
        throw new Error("Error al obtener datos de ubicación");
      }

      const lotes = await lotesResponse.json();
      const eras = await erasResponse.json();

      return {
        lotes: lotes.reduce((acc: Record<number, string>, lote: any) => {
          acc[lote.id] = lote.nombre;
          return acc;
        }, {}),
        eras: eras.reduce((acc: Record<number, {nombre: string, lote_nombre: string}>, era: any) => {
          acc[era.id] = {
            nombre: era.nombre,
            lote_nombre: lotes.find((l: any) => l.id === era.fk_lote_id)?.nombre || `Lote ${era.fk_lote_id}`
          };
          return acc;
        }, {})
      };
    } catch (error) {
      console.error("Error al obtener nombres de ubicación:", error);
      return { lotes: {}, eras: {} };
    }
  };

  const addHeader = (isFirstPage = true) => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Monitoreo Agrícola", 105, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado el: ${formatDateTimeForDisplay(new Date())}`, 105, yPosition, { align: "center" });
    yPosition += 15;

    if (!isFirstPage) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Página ${pageNumber}`, 195, 15);
    }
  };

  const addFiltersSection = (locationNames: {lotes: Record<number, string>, eras: Record<number, {nombre: string, lote_nombre: string}>}) => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Filtros aplicados", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    let filtersText = "• Todos los sensores";
    if (options.sensorTypes?.length) {
      filtersText += `\n• Tipos: ${options.sensorTypes.map(t => SENSOR_TYPES.find(st => st.key === t)?.label).join(", ")}`;
    }
    if (options.loteId) {
      filtersText += `\n• Lote: ${locationNames.lotes[options.loteId] || `Lote ${options.loteId}`}`;
    }
    if (options.eraId) {
      const eraInfo = locationNames.eras[options.eraId];
      filtersText += `\n• Era: ${eraInfo ? `${eraInfo.nombre} (${eraInfo.lote_nombre})` : `Era ${options.eraId}`}`;
    }
    if (options.cultivoId && options.includeET) {
      filtersText += `\n• Cultivo: ${options.cultivoId}`; // Aquí podrías agregar nombres de cultivos si los tienes
    }
    if (options.timeRange) {
      filtersText += `\n• Rango de fechas: ${formatDateForDisplay(options.timeRange.start)} - ${formatDateForDisplay(options.timeRange.end)}`;
    }

    const splitText = doc.splitTextToSize(filtersText, 180);
    doc.text(splitText, margin, yPosition);
    yPosition += splitText.length * 5 + 10;
  };

  const fetchSensorData = async (): Promise<SensorData[]> => {
    const params = new URLSearchParams();
    if (options.sensorTypes?.length) {
      params.append('type', options.sensorTypes.join(','));
    }
    if (options.loteId) {
      params.append('lote_id', options.loteId.toString());
    }
    if (options.eraId) {
      params.append('era_id', options.eraId.toString());
    }
    if (options.timeRange) {
      const diffMs = options.timeRange.end.getTime() - options.timeRange.start.getTime();
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      params.append('hours', diffHours.toString());
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sensor/history/?${params.toString()}`);
      if (!response.ok) throw new Error("Error al obtener datos históricos");
      return await response.json();
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      return [];
    }
  };

  const fetchETData = async (): Promise<ETData[]> => {
    if (!options.loteId || !options.includeET) return [];
    
    try {
      const url = options.cultivoId 
        ? `http://127.0.0.1:8000/api/evapotranspiracion/historica/?lote_id=${options.loteId}&cultivo_id=${options.cultivoId}`
        : `http://127.0.0.1:8000/api/evapotranspiracion/historica/?lote_id=${options.loteId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener datos de evapotranspiración");
      return await response.json();
    } catch (error) {
      console.error("Error fetching ET data:", error);
      return [];
    }
  };

  const addSensorDataTable = (sensorData: SensorData[], locationNames: {lotes: Record<number, string>, eras: Record<number, {nombre: string, lote_nombre: string}>}) => {
    if (sensorData.length === 0) {
      doc.setFontSize(12);
      doc.text("No hay datos de sensores para los filtros seleccionados", margin, yPosition);
      yPosition += 10;
      return;
    }

    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
      pageNumber++;
      addHeader(false);
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Datos Históricos de Sensores", margin, yPosition);
    yPosition += 8;

    const tableData = sensorData.map((sensor) => [
      sensor.id.toString(),
      SENSOR_TYPES.find(t => t.key === sensor.tipo)?.label || sensor.tipo,
      `${sensor.valor.toFixed(2)} ${SENSOR_UNITS[sensor.tipo]}`,
      sensor.umbral_minimo ? `${sensor.umbral_minimo.toFixed(2)} ${SENSOR_UNITS[sensor.tipo]}` : 'N/A',
      sensor.umbral_maximo ? `${sensor.umbral_maximo.toFixed(2)} ${SENSOR_UNITS[sensor.tipo]}` : 'N/A',
      formatDateTimeForDisplay(sensor.fecha),
      sensor.fk_lote_id 
        ? `Lote ${locationNames.lotes[sensor.fk_lote_id] || sensor.fk_lote_id}` 
        : sensor.fk_eras_id 
          ? `Era ${locationNames.eras[sensor.fk_eras_id]?.nombre || sensor.fk_eras_id} (${locationNames.eras[sensor.fk_eras_id]?.lote_nombre || 'Sin lote'})` 
          : 'N/A'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['ID', 'Tipo', 'Valor', 'Umbral Mín', 'Umbral Máx', 'Fecha', 'Ubicación']],
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
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 40 },
        6: { cellWidth: 20 }
      },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 10;
      }
    });
  };

  const addAlertsSection = (sensorData: SensorData[], locationNames: {lotes: Record<number, string>, eras: Record<number, {nombre: string, lote_nombre: string}>}) => {
    if (!options.includeAlerts) return;
    
    const alerts = sensorData.filter(sensor => {
      if (sensor.umbral_minimo === null || sensor.umbral_maximo === null) return false;
      return sensor.valor < sensor.umbral_minimo || sensor.valor > sensor.umbral_maximo;
    });

    if (alerts.length === 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
        pageNumber++;
        addHeader(false);
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Alertas", margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("No se encontraron alertas en el período seleccionado", margin, yPosition);
      yPosition += 10;
      return;
    }

    if (yPosition > 220) {
      doc.addPage();
      yPosition = margin;
      pageNumber++;
      addHeader(false);
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Alertas (${alerts.length})`, margin, yPosition);
    yPosition += 8;

    const tableData = alerts.map(alert => [
      alert.id.toString(),
      SENSOR_TYPES.find(t => t.key === alert.tipo)?.label || alert.tipo,
      `${alert.valor.toFixed(2)} ${SENSOR_UNITS[alert.tipo]}`,
      `${alert.umbral_minimo?.toFixed(2)} - ${alert.umbral_maximo?.toFixed(2)} ${SENSOR_UNITS[alert.tipo]}`,
      formatDateTimeForDisplay(alert.fecha),
      alert.fk_lote_id 
        ? `Lote ${locationNames.lotes[alert.fk_lote_id] || alert.fk_lote_id}` 
        : alert.fk_eras_id 
          ? `Era ${locationNames.eras[alert.fk_eras_id]?.nombre || alert.fk_eras_id} (${locationNames.eras[alert.fk_eras_id]?.lote_nombre || 'Sin lote'})` 
          : 'N/A'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['ID', 'Tipo', 'Valor', 'Rango Normal', 'Fecha', 'Ubicación']],
      body: tableData,
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
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
        5: { cellWidth: 20 }
      },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 10;
      }
    });
  };

  const addETSection = (etData: ETData[]) => {
    if (!options.includeET || !options.loteId || etData.length === 0) return;

    if (yPosition > 220) {
      doc.addPage();
      yPosition = margin;
      pageNumber++;
      addHeader(false);
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Evapotranspiración", margin, yPosition);
    yPosition += 8;

    // Tabla de datos ET
    const tableData = etData.map(et => [
      formatDateForDisplay(et.fecha),
      `${et.et_mm_dia.toFixed(2)} mm/día`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Evapotranspiración']],
      body: tableData,
      margin: { left: margin, right: margin },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 }
      },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 15;
      }
    });

    if (yPosition < 200 && options.includeCharts) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '600px';
        tempDiv.style.height = '300px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-1000px';
        document.body.appendChild(tempDiv);

        const { createRoot } = require('react-dom/client');
        const { EvapotranspiracionChart } = require('../components/EvapotranspiracionChart');
        const root = createRoot(tempDiv);
        root.render(<EvapotranspiracionChart nuevoDato={null} data={etData} />);

        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              const canvas = await html2canvas(tempDiv);
              const imgData = canvas.toDataURL('image/png');
              
              const imgWidth = 180;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
              yPosition += imgHeight + 10;
              
              root.unmount();
              document.body.removeChild(tempDiv);
              resolve();
            } catch (error) {
              console.error("Error al generar gráfica ET:", error);
              root.unmount();
              document.body.removeChild(tempDiv);
              resolve();
            }
          }, 1000);
        });
      } catch (error) {
        console.error("Error al preparar gráfica ET:", error);
      }
    }
  };

  const addSensorCharts = async (sensorData: SensorData[]) => {
    if (!options.includeCharts) return;

    const dataByType: Record<string, SensorData[]> = {};
    sensorData.forEach(sensor => {
      if (!dataByType[sensor.tipo]) {
        dataByType[sensor.tipo] = [];
      }
      dataByType[sensor.tipo].push(sensor);
    });

    for (const [tipo, datos] of Object.entries(dataByType)) {
      if (yPosition > 150) {
        doc.addPage();
        yPosition = margin;
        pageNumber++;
        addHeader(false);
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Gráfica: ${SENSOR_TYPES.find(t => t.key === tipo)?.label || tipo}`, margin, yPosition);
      yPosition += 8;

      try {
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '600px';
        tempDiv.style.height = '300px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-1000px';
        document.body.appendChild(tempDiv);

        const { createRoot } = require('react-dom/client');
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = require('recharts');
        
        const chartData = datos.map(d => ({
          fecha: new Date(d.fecha).toLocaleTimeString(),
          valor: d.valor,
          min: d.umbral_minimo,
          max: d.umbral_maximo
        }));

        const root = createRoot(tempDiv);
        root.render(
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} ${SENSOR_UNITS[tipo]}`, 'Valor']}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke="#8884d8" 
                activeDot={{ r: 6 }} 
              />
              {datos[0].umbral_minimo !== null && (
                <Line 
                  type="monotone" 
                  dataKey="min" 
                  stroke="#ff0000" 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              )}
              {datos[0].umbral_maximo !== null && (
                <Line 
                  type="monotone" 
                  dataKey="max" 
                  stroke="#ff0000" 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            try {
              const canvas = await html2canvas(tempDiv);
              const imgData = canvas.toDataURL('image/png');
              
              const imgWidth = 180;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
              yPosition += imgHeight + 10;
              
              root.unmount();
              document.body.removeChild(tempDiv);
              resolve();
            } catch (error) {
              console.error("Error al generar gráfica:", error);
              root.unmount();
              document.body.removeChild(tempDiv);
              resolve();
            }
          }, 1000);
        });
      } catch (error) {
        console.error("Error al preparar gráfica:", error);
        continue;
      }
    }
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount}`,
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
  };

  try {
    // Obtener nombres de ubicaciones primero
    const locationNames = await fetchLocationNames();
    
    addHeader();
    addFiltersSection(locationNames);
    
    const sensorData = await fetchSensorData();
    addSensorDataTable(sensorData, locationNames);
    
    if (sensorData.length > 0) {
      if (options.includeCharts) {
        await addSensorCharts(sensorData);
      }
      
      if (options.includeAlerts) {
        addAlertsSection(sensorData, locationNames);
      }
    }
    
    if (options.includeET && options.loteId) {
      const etData = await fetchETData();
      await addETSection(etData);
    }
    
    addFooter();
    
    const fileName = `Reporte_Sensores_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return false;
  }
}
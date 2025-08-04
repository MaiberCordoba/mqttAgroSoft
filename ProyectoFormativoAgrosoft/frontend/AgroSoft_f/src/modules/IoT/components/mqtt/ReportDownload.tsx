import { useRef, forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Thermometer, Droplets, Sun, LandPlot, Volume2, ClipboardList, Lightbulb } from "lucide-react";

// Importar logos como módulos
import agrosoftLogo from '../../../../../public/logoAgrosoft.png';
import senaLogo from '../../../../../public/sena.png';

Chart.register(...registerables);

interface SensorData {
  temp: string;
  humidity: string;
  luminosity: string;
  soilMoisture: string;
  sound: string;
  timestamp: number;
}

interface ReportPDFProps {
  historicalData: SensorData[];
}

export interface ReportPDFRef {
  generateReport: () => Promise<void>;
}

export const ReportPDF = forwardRef<ReportPDFRef, ReportPDFProps>(
  ({ historicalData }, ref) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Pre-cargar logos
    const agrosoftLogoRef = useRef<string>(agrosoftLogo);
    const senaLogoRef = useRef<string>(senaLogo);

    const calculateStats = (
      data: number[]
    ): { min: number; max: number; avg: number } => {
      if (data.length === 0) return { min: 0, max: 0, avg: 0 };

      const min = Math.min(...data);
      const max = Math.max(...data);
      const avg = data.reduce((sum, val) => sum + val, 0) / data.length;

      return { min, max, avg };
    };

    // Función para generar observaciones y recomendaciones
    const generateInsights = () => {
      if (historicalData.length === 0) return { observations: [], recommendations: [] };

      type SensorKey = 'temp' | 'humidity' | 'luminosity' | 'soilMoisture' | 'sound';
      type Insight = { max: { value: number; time: number }; min: { value: number; time: number } };
      const insights: Record<SensorKey, Insight> = {
        temp: { max: { value: -Infinity, time: 0 }, min: { value: Infinity, time: 0 } },
        humidity: { max: { value: -Infinity, time: 0 }, min: { value: Infinity, time: 0 } },
        luminosity: { max: { value: -Infinity, time: 0 }, min: { value: Infinity, time: 0 } },
        soilMoisture: { max: { value: -Infinity, time: 0 }, min: { value: Infinity, time: 0 } },
        sound: { max: { value: -Infinity, time: 0 }, min: { value: Infinity, time: 0 } }
      };

      // Encontrar valores máximos y mínimos con sus timestamps
      historicalData.forEach(data => {
        const sensors: SensorKey[] = ['temp', 'humidity', 'luminosity', 'soilMoisture', 'sound'];
        
        sensors.forEach((sensor) => {
          const value = Number(data[sensor]);
          if (value > insights[sensor].max.value) {
            insights[sensor].max.value = value;
            insights[sensor].max.time = data.timestamp;
          }
          if (value < insights[sensor].min.value) {
            insights[sensor].min.value = value;
            insights[sensor].min.time = data.timestamp;
          }
        });
      });

      // Generar observaciones
      const observations = [];
      
      observations.push(` Temperatura máxima (${insights.temp.max.value.toFixed(1)}°C) registrada a las ${new Date(insights.temp.max.time).toLocaleTimeString()}`);
      observations.push(` Temperatura mínima (${insights.temp.min.value.toFixed(1)}°C) registrada a las ${new Date(insights.temp.min.time).toLocaleTimeString()}`);
      
      observations.push(` Humedad máxima (${insights.humidity.max.value.toFixed(1)}%) registrada a las ${new Date(insights.humidity.max.time).toLocaleTimeString()}`);
      observations.push(` Humedad mínima (${insights.humidity.min.value.toFixed(1)}%) registrada a las ${new Date(insights.humidity.min.time).toLocaleTimeString()}`);
      
      observations.push(` Luminosidad máxima (${insights.luminosity.max.value.toFixed(1)}lx) registrada a las ${new Date(insights.luminosity.max.time).toLocaleTimeString()}`);
      observations.push(` Luminosidad mínima (${insights.luminosity.min.value.toFixed(1)}lx) registrada a las ${new Date(insights.luminosity.min.time).toLocaleTimeString()}`);
      
      observations.push(` Humedad suelo máxima (${insights.soilMoisture.max.value.toFixed(1)}%) registrada a las ${new Date(insights.soilMoisture.max.time).toLocaleTimeString()}`);
      observations.push(` Humedad suelo mínima (${insights.soilMoisture.min.value.toFixed(1)}%) registrada a las ${new Date(insights.soilMoisture.min.time).toLocaleTimeString()}`);
      
      observations.push(` Sonido máximo (${insights.sound.max.value.toFixed(1)}dB) registrado a las ${new Date(insights.sound.max.time).toLocaleTimeString()}`);
      observations.push(` Sonido mínimo (${insights.sound.min.value.toFixed(1)}dB) registrado a las ${new Date(insights.sound.min.time).toLocaleTimeString()}`);

      // Generar recomendaciones basadas en los datos
      const recommendations = [];
      
      // Recomendaciones para temperatura
      if (insights.temp.max.value > 30) {
        recommendations.push(`❄️ Considera implementar sistemas de enfriamiento (ventilación/sombra) para las horas cercanas a ${new Date(insights.temp.max.time).toLocaleTimeString()} cuando se alcanzan temperaturas altas`);
      } else if (insights.temp.min.value < 15) {
        recommendations.push(`🔥 Considera sistemas de calefacción o protección contra frío para las horas cercanas a ${new Date(insights.temp.min.time).toLocaleTimeString()}`);
      }
      
      // Recomendaciones para humedad suelo
      if (insights.soilMoisture.min.value < 30) {
        recommendations.push(`💦 Se detectó baja humedad en el suelo (${insights.soilMoisture.min.value.toFixed(1)}%) a las ${new Date(insights.soilMoisture.min.time).toLocaleTimeString()}. Considera ajustar el riego`);
      } else if (insights.soilMoisture.max.value > 80) {
        recommendations.push(`⚠️ Humedad del suelo excesiva (${insights.soilMoisture.max.value.toFixed(1)}%) detectada a las ${new Date(insights.soilMoisture.max.time).toLocaleTimeString()}. Verifica drenaje`);
      }
      
      // Recomendaciones para luminosidad
      if (insights.luminosity.min.value < 100) {
        recommendations.push(`💡 Baja luminosidad detectada (${insights.luminosity.min.value.toFixed(1)}lx) a las ${new Date(insights.luminosity.min.time).toLocaleTimeString()}. Considera complementar con luz artificial si es necesario`);
      }
      
      // Recomendaciones para sonido
      if (insights.sound.max.value > 70) {
        recommendations.push(`🔇 Niveles de sonido elevados (${insights.sound.max.value.toFixed(1)}dB) detectados a las ${new Date(insights.sound.max.time).toLocaleTimeString()}. Investiga posibles fuentes de ruido`);
      }

      return { observations, recommendations };
    };

    const { observations, recommendations } = generateInsights();

    const generatePDF = async () => {
      if (!reportRef.current) return;

      // Definiciones de PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // Margen uniforme para el PDF
      const logoSize = 15;

      // --- Encabezado CREADO SOLO CON JSPDF ---
      const headerTextLine1Y = margin + logoSize / 2 + 3;
      const headerTextLine2Y = margin + logoSize + 8;
      const headerLineY = headerTextLine2Y + 7;
      const headerHeight = headerLineY + 5;

      // --- Pie de página CREADO SOLO CON JSPDF ---
      const footerTextY = pageHeight - margin + 3; // Posición Y para el texto del pie de página (justo encima del margen inferior)
      const footerLineY = pageHeight - margin - 5; // Posición Y para la línea del pie de página
      const footerHeight = margin + 5; // Altura que "ocupa" el pie de página desde abajo

      // Temporalmente ajustar el DOM para la captura de html2canvas
      const originalPaddingTop = reportRef.current.style.paddingTop;
      const originalPaddingBottom = reportRef.current.style.paddingBottom; // Guardar padding-bottom original
      const originalPosition = containerRef.current!.style.position;
      const originalLeft = containerRef.current!.style.left;
      const originalOpacity = containerRef.current!.style.opacity;
      const originalPointerEvents = containerRef.current!.style.pointerEvents;
      const originalWidth = containerRef.current!.style.width;
      const originalHeight = containerRef.current!.style.height;

      try {
        // Establecer estilos para la captura
        containerRef.current!.style.position = 'fixed';
        containerRef.current!.style.top = '0';
        containerRef.current!.style.left = '-9999px'; // Fuera de la vista
        containerRef.current!.style.width = '794px'; // Ancho A4 en px para html2canvas (aprox 210mm * 3.7795 px/mm)
        containerRef.current!.style.height = 'auto';
        containerRef.current!.style.zIndex = '10000';
        containerRef.current!.style.opacity = '0';
        containerRef.current!.style.pointerEvents = 'none';

        // Escala para html2canvas
        const html2canvasScale = 2;

        // Ajustar el padding-top y padding-bottom del div a capturar
        const paddingTopPx = (headerHeight / pdf.internal.scaleFactor) * html2canvasScale;
        const paddingBottomPx = (footerHeight / pdf.internal.scaleFactor) * html2canvasScale; // Espacio para el pie de página
        reportRef.current.style.paddingTop = `${paddingTopPx}px`;
        reportRef.current.style.paddingBottom = `${paddingBottomPx}px`;

        // Pequeño retraso para asegurar que los gráficos se rendericen completamente
        await new Promise(resolve => setTimeout(resolve, 300)); 

        const canvas = await html2canvas(reportRef.current, {
          scale: html2canvasScale,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidthPx = imgProps.width;
        const imgHeightPx = imgProps.height;

        // Calcular la relación de píxeles a milímetros para la imagen capturada
        const pdfContentWidthMm = pageWidth - (2 * margin);
        const pxPerMmCaptured = imgWidthPx / pdfContentWidthMm;

        // Altura disponible para el contenido en la primera página (después del encabezado y antes del pie de página)
        const availableContentHeightFirstPageMm = pageHeight - headerHeight - footerHeight; 
        const availableContentHeightFirstPagePx = availableContentHeightFirstPageMm * pxPerMmCaptured;

        // Altura disponible para el contenido en páginas subsiguientes (entre margen superior y pie de página)
        const availableContentHeightSubsequentPagesMm = pageHeight - (2 * margin) - (footerHeight - margin); // Ajuste aquí
        const availableContentHeightSubsequentPagesPx = availableContentHeightSubsequentPagesMm * pxPerMmCaptured;

        let currentImgSliceYPx = 0;
        let pageNumber = 0;
        let totalPages = 1; // Mínimo una página
        if (imgHeightPx > availableContentHeightFirstPagePx) {
            totalPages += Math.ceil((imgHeightPx - availableContentHeightFirstPagePx) / availableContentHeightSubsequentPagesPx);
        }

        while (currentImgSliceYPx < imgHeightPx) {
          if (pageNumber > 0) {
            pdf.addPage();
          }

          // Dibujar el encabezado en cada página
          pdf.addImage(senaLogoRef.current, "PNG", margin, margin, logoSize, logoSize);
          pdf.addImage(agrosoftLogoRef.current, "PNG", pageWidth - margin - logoSize, margin, logoSize, logoSize);
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text("Reporte de Sensores", pageWidth / 2, headerTextLine1Y, { align: "center", baseline: "middle" });
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Generado: ${new Date().toLocaleString()}`, pageWidth / 2, headerTextLine2Y, { align: "center" });
          pdf.line(margin, headerLineY, pageWidth - margin, headerLineY);


          const currentAvailablePxHeight = pageNumber === 0 ? 
                                           availableContentHeightFirstPagePx : 
                                           availableContentHeightSubsequentPagesPx;

          const sliceHeightPx = Math.min(currentAvailablePxHeight, imgHeightPx - currentImgSliceYPx);
          const sliceHeightMm = sliceHeightPx / pxPerMmCaptured;

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sliceHeightPx;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 
                              0, currentImgSliceYPx,
                              canvas.width, sliceHeightPx,
                              0, 0,
                              canvas.width, sliceHeightPx);
          }
          const tempImgData = tempCanvas.toDataURL('image/png');

          pdf.addImage(
            tempImgData,
            "PNG",
            margin,
            pageNumber === 0 ? headerHeight : margin,
            pdfContentWidthMm,
            sliceHeightMm
          );

          // Dibujar el pie de página en cada página
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.line(margin, footerLineY, pageWidth - margin, footerLineY);
          pdf.text(`Reporte generado automáticamente por Agrosoft - Todos los derechos reservados`, pageWidth / 2, footerTextY, { align: 'center' });
          pdf.text(`Página ${pageNumber + 1}/${totalPages}`, pageWidth - margin, footerTextY, { align: 'right' });


          pageNumber++;
          currentImgSliceYPx += sliceHeightPx;
        }
        
        pdf.save("reporte_sensores.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      } finally {
        // Restaurar estilos originales del contenedor y del reportRef
        if (containerRef.current) {
          containerRef.current.style.position = originalPosition;
          containerRef.current.style.left = originalLeft;
          containerRef.current.style.opacity = originalOpacity;
          containerRef.current.style.pointerEvents = originalPointerEvents;
          containerRef.current.style.width = originalWidth;
          containerRef.current.style.height = originalHeight;
        }
        if (reportRef.current) {
          reportRef.current.style.paddingTop = originalPaddingTop;
          reportRef.current.style.paddingBottom = originalPaddingBottom; // Restaurar padding-bottom
        }
      }
    };

    useImperativeHandle(ref, () => ({
      generateReport: async () => {
        await generatePDF();
      },
    }));

    const prepareChartData = (
      sensorType: keyof SensorData,
      label: string,
      color: string
    ) => {
      const data = historicalData.map((d) => Number(d[sensorType]));

      return {
        labels: historicalData.map((d) =>
          new Date(d.timestamp).toLocaleTimeString()
        ),
        datasets: [
          {
            label,
            data,
            borderColor: color,
            backgroundColor: `${color}20`,
            tension: 0.3,
            pointRadius: 2,
            fill: true,
          },
        ],
      };
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) =>
              `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          min: 0,
          grid: { color: "rgba(0, 0, 0, 0.05)" },
          ticks: {
            maxTicksLimit: 5,
            padding: 5,
          },
          border: { display: false },
        },
      },
    };

    const stats = {
      temp: calculateStats(historicalData.map((d) => Number(d.temp))),
      humidity: calculateStats(historicalData.map((d) => Number(d.humidity))),
      luminosity: calculateStats(
        historicalData.map((d) => Number(d.luminosity))
      ),
      soilMoisture: calculateStats(
        historicalData.map((d) => Number(d.soilMoisture))
      ),
      sound: calculateStats(historicalData.map((d) => Number(d.sound))),
    };

    return (
      <div ref={containerRef} style={{ position: 'absolute', left: '-9999px' }}>
        <div
          ref={reportRef}
          className="bg-white p-4 rounded-lg shadow-md mx-auto"
          style={{
            width: "794px",
            height: "auto",
            fontFamily: "Helvetica, Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          {/* Sección de estadísticas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">
              Resumen Estadístico
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Tarjeta Temperatura */}
              <div className="border rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="text-[#ff6384] mr-2">
                    <Thermometer size={20} />
                  </div>
                  <h3 className="font-semibold">Temperatura (°C)</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Mín</div>
                    <div className="font-bold">{stats.temp.min.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Máx</div>
                    <div className="font-bold">{stats.temp.max.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prom</div>
                    <div className="font-bold">{stats.temp.avg.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Humedad Ambiente */}
              <div className="border rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="text-[#36a2eb] mr-2">
                    <Droplets size={20} />
                  </div>
                  <h3 className="font-semibold">Humedad Ambiente (%)</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Mín</div>
                    <div className="font-bold">{stats.humidity.min.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Máx</div>
                    <div className="font-bold">{stats.humidity.max.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prom</div>
                    <div className="font-bold">{stats.humidity.avg.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Luminosidad */}
              <div className="border rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="text-[#f5d71e] mr-2">
                    <Sun size={20} />
                  </div>
                  <h3 className="font-semibold">Luminosidad (lx)</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Mín</div>
                    <div className="font-bold">{stats.luminosity.min.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Máx</div>
                    <div className="font-bold">{stats.luminosity.max.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prom</div>
                    <div className="font-bold">{stats.luminosity.avg.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Humedad Suelo */}
              <div className="border rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="text-[#4bc0c0] mr-2">
                    <LandPlot size={20} />
                  </div>
                  <h3 className="font-semibold">Humedad Suelo (%)</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Mín</div>
                    <div className="font-bold">{stats.soilMoisture.min.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Máx</div>
                    <div className="font-bold">{stats.soilMoisture.max.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prom</div>
                    <div className="font-bold">{stats.soilMoisture.avg.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Sonido */}
              <div className="border rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="text-[#9966ff] mr-2">
                    <Volume2 size={20} />
                  </div>
                  <h3 className="font-semibold">Sonido (dB)</h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Mín</div>
                    <div className="font-bold">{stats.sound.min.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Máx</div>
                    <div className="font-bold">{stats.sound.max.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Prom</div>
                    <div className="font-bold">{stats.sound.avg.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nueva sección de Observaciones y Recomendaciones */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">
              Observaciones y Recomendaciones
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Columna de Observaciones */}
              <div className="border rounded p-3 bg-blue-50">
                <h3 className="font-semibold mb-2 flex items-center">
                  <ClipboardList className="mr-2" size={18} />
                  Principales Observaciones
                </h3>
                <ul className="text-sm space-y-1">
                  {observations.map((obs, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Columna de Recomendaciones */}
              <div className="border rounded p-3 bg-green-50">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Lightbulb className="mr-2" size={18} />
                  Recomendaciones
                </h3>
                {recommendations.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">
                    Los valores de los sensores se encuentran dentro de rangos normales. 
                    No se requieren acciones inmediatas.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sección de gráficas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Gráficas de Sensores</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Gráfica Temperatura */}
              <div>
                <h3 className="font-medium flex items-center mb-1">
                  <Thermometer size={16} className="mr-1 text-[#ff6384]" />
                  Temperatura (°C)
                </h3>
                <div className="h-40 border rounded p-2 bg-gray-50">
                  <Line 
                    data={prepareChartData("temp", "Temperatura", "#ff6384")} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              
              {/* Gráfica Humedad Ambiente */}
              <div>
                <h3 className="font-medium flex items-center mb-1">
                  <Droplets size={16} className="mr-1 text-[#36a2eb]" />
                  Humedad Ambiente (%)
                </h3>
                <div className="h-40 border rounded p-2 bg-gray-50">
                  <Line 
                    data={prepareChartData("humidity", "Humedad", "#36a2eb")} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              
              {/* Gráfica Luminosidad */}
              <div>
                <h3 className="font-medium flex items-center mb-1">
                  <Sun size={16} className="mr-1 text-[#f5d71e]" />
                  Luminosidad (lx)
                </h3>
                <div className="h-40 border rounded p-2 bg-gray-50">
                  <Line 
                    data={prepareChartData("luminosity", "Luminosidad", "#f5d71e")} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              
              {/* Gráfica Humedad Suelo */}
              <div>
                <h3 className="font-medium flex items-center mb-1">
                  <LandPlot size={16} className="mr-1 text-[#4bc0c0]" />
                  Humedad Suelo (%)
                </h3>
                <div className="h-40 border rounded p-2 bg-gray-50">
                  <Line 
                    data={prepareChartData("soilMoisture", "Humedad Suelo", "#4bc0c0")} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              
              {/* Gráfica Sonido */}
              <div>
                <h3 className="font-medium flex items-center mb-1">
                  <Volume2 size={16} className="mr-1 text-[#9966ff]" />
                  Sonido (dB)
                </h3>
                <div className="h-40 border rounded p-2 bg-gray-50">
                  <Line 
                    data={prepareChartData("sound", "Sonido", "#9966ff")} 
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
                          min: Math.max(0, Math.min(...historicalData.map(d => Number(d.sound))) - 5),
                          max: Math.max(...historicalData.map(d => Number(d.sound))) + 5
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección de datos históricos */}
          <div>
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Datos Históricos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border py-1 px-2 text-left">Hora</th>
                    <th className="border py-1 px-2 text-center">Temp (°C)</th>
                    <th className="border py-1 px-2 text-center">H. Amb. (%)</th>
                    <th className="border py-1 px-2 text-center">Luz (lx)</th>
                    <th className="border py-1 px-2 text-center">H. Suelo (%)</th>
                    <th className="border py-1 px-2 text-center">Sonido (dB)</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.slice(0, 5).map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border py-1 px-2">
                        {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="border py-1 px-2 text-center">{data.temp}</td>
                      <td className="border py-1 px-2 text-center">{data.humidity}</td>
                      <td className="border py-1 px-2 text-center">{data.luminosity}</td>
                      <td className="border py-1 px-2 text-center">{data.soilMoisture}</td>
                      <td className="border py-1 px-2 text-center">{data.sound}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mostrando {Math.min(5, historicalData.length)} de {historicalData.length} registros
            </p>
          </div>
          
        </div>
      </div>
    );
  }
);
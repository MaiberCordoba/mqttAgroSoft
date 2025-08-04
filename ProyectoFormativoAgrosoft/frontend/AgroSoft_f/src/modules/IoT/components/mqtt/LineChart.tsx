import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

Chart.register(...registerables);

interface ChartDataPoint {
  temp: string;
  humidity: string;
  luminosity: string;
  soilMoisture: string; // Nuevo campo
  sound: string;        // Nuevo campo
}

interface LineChartProps {
  data: ChartDataPoint[];
}

export const LineChart = ({ data }: LineChartProps) => {
  const chartData: ChartData<"line"> = {
    labels: data.map((_, i) => `${i * 2} min`),
    datasets: [
      // Sensores originales
      {
        label: "Temperatura (°C)",
        data: data.map(d => Number(d.temp)),
        borderColor: "#ff6384",
        tension: 0.2,
        pointRadius: 2,
        yAxisID: 'y',
      },
      {
        label: "Humedad Ambiente(%)",
        data: data.map(d => Number(d.humidity)),
        borderColor: "#36a2eb",
        tension: 0.2,
        pointRadius: 2,
        yAxisID: 'y',
      },
      {
        label: "Luminosidad (lx)",
        data: data.map(d => Number(d.luminosity)),
        borderColor: "#f5d71e",
        tension: 0.2,
        pointRadius: 2,
        yAxisID: 'y1',
      },
      // Nuevos sensores
      {
        label: "Humedad Suelo (%)",
        data: data.map(d => Number(d.soilMoisture)),
        borderColor: "#4bc0c0",  // Color turquesa
        tension: 0.2,
        pointRadius: 2,
        yAxisID: 'y',
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tiempo",
        },
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: "°C / %",
        },
        suggestedMin: Math.min(
          ...data.map(d => Number(d.temp)),
          ...data.map(d => Number(d.humidity)),
          ...data.map(d => Number(d.soilMoisture))  // Incluir humedad suelo
        ) - 5,
        suggestedMax: Math.max(
          ...data.map(d => Number(d.temp)),
          ...data.map(d => Number(d.humidity)),
          ...data.map(d => Number(d.soilMoisture))  // Incluir humedad suelo
        ) + 5,
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: "lx / Sonido",  // Título actualizado
        },
        suggestedMin: Math.min(
          ...data.map(d => Number(d.luminosity)),
          ...data.map(d => Number(d.sound))  // Incluir sonido
        ) - 100,
        suggestedMax: Math.max(
          ...data.map(d => Number(d.luminosity)),
        ) + 100,
        grid: {
          drawOnChartArea: false,
        },
      }
    },
  };

  return <Line data={chartData} options={options} />;
};
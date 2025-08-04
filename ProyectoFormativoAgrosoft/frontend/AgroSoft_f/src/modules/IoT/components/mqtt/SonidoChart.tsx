import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin

Chart.register(...registerables, annotationPlugin); // Register annotation plugin

interface ChartDataPoint {
  temp: string;
  humidity: string;
  luminosity: string;
  soilMoisture: string;
  sound: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
}

export const Sonido = ({ data }: LineChartProps) => {
  const chartData: ChartData<"line"> = {
    labels: data.map((_, i) => `${(i * 2).toFixed(1)} min`), // More precise time labels
    datasets: [
      {
        label: "Sonido (dB)",
        data: data.map((d) => Number(d.sound)),
        borderColor: "#9966ff", // Purple for sound
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Light purple fill
        tension: 0.3, // Smoother curve
        pointRadius: 4, // Larger points
        pointHoverRadius: 6, // Larger hover points
        borderWidth: 2, // Thicker line
        fill: true, // Fill area under the line
        yAxisID: "y",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14, // Larger legend font
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)} dB`, // Precise tooltip
        },
      },
      annotation: {
        annotations: {
          threshold: {
            type: "line",
            yMin: 100, // Example threshold for sound level
            yMax: 100,
            borderColor: "#ff0000", // Red threshold line
            borderWidth: 2,
            borderDash: [6, 6], // Dashed line
            label: {
              content: "Umbral 100 dB",
              enabled: true,
              position: "center",
              backgroundColor: "rgba(255, 0, 0, 0.7)",
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tiempo (minutos)",
          font: {
            size: 14,
          },
        },
        grid: {
          display: false, // Cleaner x-axis
        },
      },
      y: {
        position: "left",
        title: {
          display: true,
          text: "Nivel de Sonido (dB)",
          font: {
            size: 14,
          },
        },
        suggestedMin: Math.min(...data.map((d) => Number(d.sound))) - 10, // Adjusted for sound
        suggestedMax: Math.max(...data.map((d) => Number(d.sound))) + 10,
        ticks: {
          stepSize: 10, // Fixed step size for readability
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
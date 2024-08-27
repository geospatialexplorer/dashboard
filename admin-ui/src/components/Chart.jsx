import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  // Generate 40 labels for the data
  const labels = Array.from({ length: 40 }, (_, i) => `Label ${i + 1}`);

  // Generate random data for two datasets
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: Array.from({ length: 40 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Dataset 2",
        data: Array.from({ length: 40 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // To control the aspect ratio manually
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Scrollable Bar Chart with 30 Data Points per View",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Set width to show only 30 data points at a time
  const visibleDataCount = 30;
  const chartWidth = visibleDataCount * 60; // 60px per data point

  return (
    <div >
      <h2
        style={{
          textAlign: "center",
          
        }}
      >
        Dynamic Bar Chart Example
      </h2>
      <div
        style={{
          marginTop: "60px",
          width: "100%",
          overflowX: "scroll",
          height: "calc(70vh - 60px)",
        }}
      >
        <div style={{ width: `${chartWidth}px`, height: "100%" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Chart;

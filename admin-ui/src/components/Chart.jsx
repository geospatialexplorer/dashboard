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

const Chart = ({ healthData, healthLoading }) => {
  // Check if data is loading
  if (healthLoading) {
    return <p>Loading...</p>;
  }

  // Check if healthData is available
  if (!healthData || healthData.length === 0) {
    return <p>No data available</p>;
  }

  // Generate labels and datasets
  const labels = healthData.map((item) => item.District);
  const dataset1 = healthData.map((item) => item["Actual prevalence"]);
  const dataset2 = healthData.map((item) => item["Reduced prevalence"]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Prevalence",
        data: dataset1,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Reduced Prevalence",
        data: dataset2,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    <div>
      <h2 style={{ textAlign: "center" }}>
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
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Chart;

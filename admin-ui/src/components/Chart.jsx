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

  // Combine the labels and datasets into a single array of objects
  const combinedData = healthData.map((item) => ({
    label: item.District,
    actualPrevalence: item["Actual prevalence"],
    reducedPrevalence: item["Reduced prevalence"],
  }));

  // Sort the combined data by 'actualPrevalence' in descending order
  combinedData.sort((a, b) => b.actualPrevalence - a.actualPrevalence);

  // Separate the sorted data back into labels and datasets
  const labels = combinedData.map((item) => item.label);
  const dataset1 = combinedData.map((item) => item.actualPrevalence);
  const dataset2 = combinedData.map((item) => item.reducedPrevalence);

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
        text: "Dummy Data Bar Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const visibleDataCount = 30;
  const chartWidth = visibleDataCount * 1000; 

  return (
    <div style={{paddingTop:"60px"}}>
      <h2 style={{ textAlign: "center" }}>
        District wise bar plot for Disease prevalence according to NFHS data
      </h2>
      <div
        style={{
          marginTop: "30px",
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

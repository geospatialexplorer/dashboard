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

  if (!healthData || healthData.length === 0) {
    return <p>No data available</p>;
  }

  // Use healthData directly without filtering
  const combinedData = healthData.map((item) => ({
    label: item.District,
    actualPrevalence: item["Actual_prevalence"],
    reducedPrevalence: item["Reduced_prevalence"],
  }));

  // Sort combined data by actualPrevalence
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
        barPercentage: 0.5,
        backgroundColor: "#F7E303",
        borderWidth: 1,
      },
      {
        label: "Reduced Prevalence",
        data: dataset2,
        barPercentage: 0.5,
        backgroundColor: "#4963AB",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Customize the step size between ticks
          stepSize: 0.2,
          // Optionally, you can use a callback to format tick labels
          callback: function (value, index, values) {
            return value; // Customize this function if you need to format the labels
          },
        },
      },
    },
  };

  // Calculate chart width based on number of data points
  const visibleDataCount = combinedData.length;
  console.log(combinedData.length, "================================");
  const chartWidth = visibleDataCount * 70;

  return (
    <div style={{ paddingTop: "60px" }}>
      <h2 style={{ textAlign: "center" }}>
        District-wise bar plot for Disease prevalence according to NFHS data
      </h2>
      <div
        style={{
          marginTop: "30px",
          width: "100%",
          overflowX: "scroll",
          height: "calc(70vh - 60px)",
        }}
      >
        <div
          style={{
            width: combinedData.length == 7070 ? "1500%" : `${chartWidth}px`,
            height: "100%",
          }}
        >
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Chart;

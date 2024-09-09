import React, { useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("Diabetes");
  const [selectedGender, setSelectedGender] = useState("Men");

  // Check if data is loading
  if (healthLoading) {
    return <p>Loading...</p>;
  }

  if (!healthData || healthData.length === 0) {
    return <p>No data available</p>;
  }

  // Filter data based on selected category and gender
  const filteredData = healthData.filter(
    (item) =>
      item.Disease === selectedCategory && item.Gender === selectedGender
  );

  const combinedData = filteredData.map((item) => ({
    label: item.District,
    actualPrevalence: item["Actual_prevalence"],
    reducedPrevalence: item["Reduced_prevalence"],
  }));

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
        backgroundColor: "#F7E303",
        borderWidth: 1,
      },
      {
        label: "Reduced Prevalence",
        data: dataset2,
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
      },
    },
  };

  // Calculate chart width based on number of data points
  const visibleDataCount = combinedData.length;
  const chartWidth = visibleDataCount * 50; // Adjust multiplier as needed

  return (
    <div style={{ paddingTop: "60px" }}>
      <h2 style={{ textAlign: "center" }}>
        District-wise bar plot for Disease prevalence according to NFHS data
      </h2>

      {/* Buttons to select the disease category */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {["Diabetes", "Hypertension", "Chronic Respiratory Disease", "Heart disease", "Cancer"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              margin: "0 10px",
              padding: "10px 20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              backgroundColor: selectedCategory === category ? "#4963AB" : "#f0f0f0",
              color: selectedCategory === category ? "#fff" : "#000",
              fontWeight: selectedCategory === category ? "bold" : "normal",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Buttons to select gender */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {["Men", "Women"].map((gender) => (
          <button
            key={gender}
            onClick={() => setSelectedGender(gender)}
            style={{
              margin: "0 10px",
              padding: "10px 20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              backgroundColor: selectedGender === gender ? "#4963AB" : "#f0f0f0",
              color: selectedGender === gender ? "#fff" : "#000",
              fontWeight: selectedGender === gender ? "bold" : "normal",
            }}
          >
            {gender}
          </button>
        ))}
      </div>

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

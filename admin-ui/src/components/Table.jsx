import { useState, useEffect } from "react";
import { Table, Card, Spin } from "antd";

// Function to calculate averages for each state
const calculateAverages = (districtsData) => {
  // Group districts by state
  const stateData = districtsData.reduce((acc, district) => {
    const state = district.State.trim();
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(district);
    return acc;
  }, {});

  return Object.keys(stateData).map((state) => {
    const districts = stateData[state];
    const totalDistricts = districts.length;

    const averages = districts.reduce(
      (acc, district) => {
        acc.actualPM2_5 += district["Actual PM2.5"] || 0;
        acc.reducedPM2_5 += district["Reduced PM2.5"] || 0;
        acc.actualPrevalence += district["Actual prevalence"] || 0;
        acc.reducedPrevalence += district["Reduced prevalence"] || 0;
        return acc;
      },
      { actualPM2_5: 0, reducedPM2_5: 0, actualPrevalence: 0, reducedPrevalence: 0 }
    );

    return {
      state,
      averageActualPM2_5: (averages.actualPM2_5 / totalDistricts).toFixed(2),
      averageReducedPM2_5: (averages.reducedPM2_5 / totalDistricts).toFixed(2),
      averageActualPrevalence: (averages.actualPrevalence / totalDistricts).toFixed(2),
      averageReducedPrevalence: (averages.reducedPrevalence / totalDistricts).toFixed(2),
      districts, // Store districts data
    };
  });
};

const StateTable = ({ healthData, healthLoading, error }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (healthData) {
      console.log("Fetched Districts Data:", healthData); // Log the fetched data
      const averages = calculateAverages(healthData);
      setData(averages);
    }
  }, [healthData]);

  if (error) return <p>Error loading data.</p>;

  const stateColumns = [
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Average Actual PM2.5",
      dataIndex: "averageActualPM2_5",
      key: "averageActualPM2_5",
    },
    {
      title: "Average Reduced PM2.5",
      dataIndex: "averageReducedPM2_5",
      key: "averageReducedPM2_5",
    },
    {
      title: "Average Actual Prevalence",
      dataIndex: "averageActualPrevalence",
      key: "averageActualPrevalence",
    },
    {
      title: "Average Reduced Prevalence",
      dataIndex: "averageReducedPrevalence",
      key: "averageReducedPrevalence",
    },
  ];

  const districtColumns = [
    {
      title: "District",
      dataIndex: "District",
      key: "district",
    },
    {
      title: "Actual PM2.5",
      dataIndex: "Actual PM2.5",
      key: "actualPM2_5",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    },
    {
      title: "Reduced PM2.5",
      dataIndex: "Reduced PM2.5",
      key: "reducedPM2_5",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    },
    {
      title: "Actual Prevalence",
      dataIndex: "Actual prevalence",
      key: "actualPrevalence",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    },
    {
      title: "Reduced Prevalence",
      dataIndex: "Reduced prevalence",
      key: "reducedPrevalence",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    },
  ];

  return (
    <Card>
      <h2>
        <center>State-Wise Average Data with District-Level Information</center>
      </h2>
      <Spin spinning={healthLoading}>
        <Table
          dataSource={data}
          columns={stateColumns}
          rowKey="state"
          pagination={{ pageSize: 25 }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={districtColumns}
                dataSource={record.districts}
                pagination={false}
                rowKey="District" // Ensure that the unique identifier for districts data is correctly referenced
              />
            ),
          }}
        />
      </Spin>
    </Card>
  );
};

export default StateTable;

import { useState } from "react";
import { Table, Card } from "antd";

// Sample data with states and districts
const stateData = {
  "Tamil Nadu": [
    {
      district: "Chennai",
      population: 10000000,
      area: 426,
      target: 20,
      actual: 35,
    },
    {
      district: "Coimbatore",
      population: 2500000,
      area: 1118,
      target: 15,
      actual: 30,
    },
    {
      district: "Madurai",
      population: 1500000,
      area: 150,
      target: 18,
      actual: 28,
    },
  ],
  Karnataka: [
    {
      district: "Bengaluru",
      population: 8000000,
      area: 709,
      target: 17,
      actual: 25,
    },
    {
      district: "Mysuru",
      population: 900000,
      area: 128,
      target: 20,
      actual: 27,
    },
    {
      district: "Hubli-Dharwad",
      population: 1000000,
      area: 406,
      target: 16,
      actual: 30,
    },
  ],
  // Additional states and districts can be added similarly
};

// Function to calculate averages for each state
const calculateAverages = () => {
  return Object.keys(stateData).map((state) => {
    const districts = stateData[state];
    const totalDistricts = districts.length;

    const averages = districts.reduce(
      (acc, district) => {
        acc.population += district.population;
        acc.area += district.area;
        acc.target += district.target;
        acc.actual += district.actual;
        return acc;
      },
      { population: 0, area: 0, target: 0, actual: 0 }
    );

    return {
      state,
      averagePopulation: Math.round(averages.population / totalDistricts),
      averageArea: Math.round(averages.area / totalDistricts),
      averageTarget: Math.round(averages.target / totalDistricts),
      averageActual: Math.round(averages.actual / totalDistricts),
      districts: stateData[state], // Store districts data
    };
  });
};

const StateTable = () => {
  const [data] = useState(calculateAverages());

  const stateColumns = [
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Average Population",
      dataIndex: "averagePopulation",
      key: "averagePopulation",
    },
    {
      title: "Average Area (sq km)",
      dataIndex: "averageArea",
      key: "averageArea",
    },
    {
      title: "Average Target PM 2.5 (ug/m3)",
      dataIndex: "averageTarget",
      key: "averageTarget",
    },
    {
      title: "Average Actual PM 2.5 (ug/m3)",
      dataIndex: "averageActual",
      key: "averageActual",
    },
  ];

  const districtColumns = [
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
    },
    {
      title: "Area (sq km)",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Target PM 2.5 (ug/m3)",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "Actual PM 2.5 (ug/m3)",
      dataIndex: "actual",
      key: "actual",
    },
  ];

  return (
    <Card>
      <h2>
        <center>
          State-Wise Average Data with District-Level Information
        </center>
      </h2>
      <Table
        dataSource={data}
        columns={stateColumns}
        rowKey="state"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // Enables horizontal scrolling
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={districtColumns}
              dataSource={record.districts}
              pagination={false}
              rowKey="district"
            />
          ),
        }}
      />
    </Card>
  );
};

export default StateTable;

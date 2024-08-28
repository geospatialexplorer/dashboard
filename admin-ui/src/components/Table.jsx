import { useState } from "react";
import { Table, Select, Input, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Expanded dataset with Indian states and districts
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
    {
      district: "Salem",
      population: 600000,
      area: 585,
      target: 22,
      actual: 32,
    },
    {
      district: "Tiruchirappalli",
      population: 500000,
      area: 444,
      target: 25,
      actual: 33,
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
    {
      district: "Belagavi",
      population: 500000,
      area: 155,
      target: 21,
      actual: 29,
    },
    {
      district: "Dakshina Kannada",
      population: 2000000,
      area: 4856,
      target: 19,
      actual: 31,
    },
  ],
  Maharashtra: [
    {
      district: "Mumbai",
      population: 12000000,
      area: 603,
      target: 23,
      actual: 33,
    },
    {
      district: "Pune",
      population: 3000000,
      area: 730,
      target: 22,
      actual: 34,
    },
    {
      district: "Nagpur",
      population: 2500000,
      area: 217,
      target: 25,
      actual: 35,
    },
    {
      district: "Aurangabad",
      population: 1000000,
      area: 165,
      target: 24,
      actual: 32,
    },
    {
      district: "Nashik",
      population: 2000000,
      area: 228,
      target: 26,
      actual: 33,
    },
  ],
  "Uttar Pradesh": [
    {
      district: "Lucknow",
      population: 2800000,
      area: 250,
      target: 30,
      actual: 37,
    },
    {
      district: "Kanpur",
      population: 3000000,
      area: 605,
      target: 32,
      actual: 36,
    },
    {
      district: "Varanasi",
      population: 1200000,
      area: 139,
      target: 28,
      actual: 33,
    },
    {
      district: "Agra",
      population: 1500000,
      area: 188,
      target: 27,
      actual: 35,
    },
    {
      district: "Gorakhpur",
      population: 650000,
      area: 289,
      target: 26,
      actual: 34,
    },
  ],
  "West Bengal": [
    {
      district: "Kolkata",
      population: 4500000,
      area: 185,
      target: 24,
      actual: 32,
    },
    {
      district: "Howrah",
      population: 1000000,
      area: 150,
      target: 22,
      actual: 31,
    },
    {
      district: "Darjeeling",
      population: 120000,
      area: 3149,
      target: 19,
      actual: 29,
    },
    {
      district: "Murshidabad",
      population: 700000,
      area: 5321,
      target: 21,
      actual: 30,
    },
  ],
  // Add more states and districts if needed
};

const Tabledata = () => {
  const [selectedStates, setSelectedStates] = useState(["Tamil Nadu"]);
  const [searchText, setSearchText] = useState("");
  const [stateSearch, setStateSearch] = useState("");

  const handleStateChange = (value) => {
    setSelectedStates(value);
    setSearchText(""); // Clear search text when states change
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = selectedStates
    .flatMap((state) => stateData[state] || [])
    .filter((item) =>
      item.district.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns = [
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
          Disease Prevalence According to NFHS and PM2.5 Concentration
        </center>
      </h2>
      <Select
        mode="multiple"
        placeholder="Select States"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={handleStateChange}
        value={selectedStates}
      >
        {Object.keys(stateData)
          .filter((state) =>
            state.toLowerCase().includes(stateSearch.toLowerCase())
          )
          .map((state) => (
            <Select.Option key={state} value={state}>
              {state}
            </Select.Option>
          ))}
      </Select>
      <Input
        placeholder="Search District"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: "100%" }}
        prefix={<SearchOutlined />}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="district"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // Enables horizontal scrolling
      />
    </Card>
  );
};

export default Tabledata;

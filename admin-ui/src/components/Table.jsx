import React, { useState } from "react";
import { Table, Select, Input, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Expanded dataset with Indian states and districts
const stateData = {
  "Tamil Nadu": [
    { district: "Chennai", population: 10000000, area: 426 },
    { district: "Coimbatore", population: 2500000, area: 1118 },
    { district: "Madurai", population: 1500000, area: 150 },
    { district: "Salem", population: 600000, area: 585 },
    { district: "Tiruchirappalli", population: 500000, area: 444 },
  ],
  Karnataka: [
    { district: "Bengaluru", population: 8000000, area: 709 },
    { district: "Mysuru", population: 900000, area: 128 },
    { district: "Hubli-Dharwad", population: 1000000, area: 406 },
    { district: "Belagavi", population: 500000, area: 155 },
    { district: "Dakshina Kannada", population: 2000000, area: 4856 },
  ],
  Maharashtra: [
    { district: "Mumbai", population: 12000000, area: 603 },
    { district: "Pune", population: 3000000, area: 730 },
    { district: "Nagpur", population: 2500000, area: 217 },
    { district: "Aurangabad", population: 1000000, area: 165 },
    { district: "Nashik", population: 2000000, area: 228 },
  ],
  "Uttar Pradesh": [
    { district: "Lucknow", population: 2800000, area: 250 },
    { district: "Kanpur", population: 3000000, area: 605 },
    { district: "Varanasi", population: 1200000, area: 139 },
    { district: "Agra", population: 1500000, area: 188 },
    { district: "Gorakhpur", population: 650000, area: 289 },
  ],
  "West Bengal": [
    { district: "Kolkata", population: 4500000, area: 185 },
    { district: "Howrah", population: 1000000, area: 150 },
    { district: "Darjeeling", population: 120000, area: 3149 },
    { district: "Murshidabad", population: 700000, area: 5321 },
  ],
  // Add more states and districts if needed
};

const Tabledata = () => {
  // Default to Tamil Nadu
  const [selectedStates, setSelectedStates] = useState(["Tamil Nadu"]);
  const [searchText, setSearchText] = useState("");
  const [stateSearch, setStateSearch] = useState(""); // For searching states

  // Update selected states and reset search text
  const handleStateChange = (value) => {
    setSelectedStates(value);
    setSearchText(""); // Clear search text when states change
  };



  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter and aggregate data based on selected states
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
      title: "Disease prevalence according to NFHS (in %)",
      dataIndex: "population",
      key: "population",
    },
    {
      title: "Area (sq km)",
      dataIndex: "area",
      key: "area",
    },
  ];

  return (
    <Card>
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
      />
    </Card>
  );
};

export default Tabledata;

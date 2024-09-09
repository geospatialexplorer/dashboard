import { useState, useEffect } from "react";
import { Table, Card, Spin, Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Function to calculate average values for each state

// Function to calculate average PM2.5 concentration for each state
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

  // Calculate averages for each state
  return Object.keys(stateData).map((state) => {
    const districts = stateData[state];
    const totalDistricts = districts.length;

    // Sum up values for averaging
    const averages = districts.reduce(
      (acc, district) => {
        acc.actualPM2_5 += parseFloat(district["ActualPM"]) || 0;
        acc.reducedPM2_5 += parseFloat(district["ReducedPM"]) || 0;
        acc.actualPrevalence += parseFloat(district["Actual_prevalence"]) || 0;
        acc.reducedPrevalence +=
          parseFloat(district["Reduced_prevalence"]) || 0;
        return acc;
      },
      {
        actualPM2_5: 0,
        reducedPM2_5: 0,
        actualPrevalence: 0,
        reducedPrevalence: 0,
      }
    );

    // Calculate averages
    return {
      state,
      averageActualPM2_5: (averages.actualPM2_5 / totalDistricts).toFixed(2),
      averageReducedPM2_5: (averages.reducedPM2_5 / totalDistricts).toFixed(2),
      averageActualPrevalence: (
        averages.actualPrevalence / totalDistricts
      ).toFixed(2),
      averageReducedPrevalence: (
        averages.reducedPrevalence / totalDistricts
      ).toFixed(2),
      districts,
    };
  });
};



// Columns for the state-level table
const stateColumns = [
  {
    title: "State",
    dataIndex: "state",
    key: "state",
    sorter: (a, b) => a.state.localeCompare(b.state),
    width: 200,
  },
  {
    title: "Disease prevalence according to NFHS",
    dataIndex: "averageActualPrevalence",
    key: "averageActualPrevalence",
    sorter: (a, b) => a.averageActualPrevalence - b.averageActualPrevalence,
    width: 200,
  },
  {
    title: "Disease prevalence if NCAP targets are met",
    dataIndex: "averageReducedPrevalence",
    key: "averageReducedPrevalence",
    sorter: (a, b) => a.averageReducedPrevalence - b.averageReducedPrevalence,
    width: 200,
  },
  {
    title: "Actual PM concentration",
    dataIndex: "averageActualPM2_5",
    key: "averageActualPM2_5",
    sorter: (a, b) => a.averageActualPM2_5 - b.averageActualPM2_5,
    width: 200,
  },
  {
    title: "Targeted PM concentration by NCAP",
    dataIndex: "averageReducedPM2_5",
    key: "averageReducedPM2_5",
    sorter: (a, b) => a.averageReducedPM2_5 - b.averageReducedPM2_5,
    width: 200,
  },
];

// Columns for the district-level table
const districtColumns = [
  {
    title: "District",
    dataIndex: "District",
    key: "district",
    sorter: (a, b) => a.District.localeCompare(b.District),
    width: 200,
  },
  {
    title: "Actual PM",
    dataIndex: "ActualPM",
    key: "actualPM",
    render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    sorter: (a, b) => parseFloat(a.ActualPM) - parseFloat(b.ActualPM),
    width: 200,
  },
  {
    title: "Reduced PM",
    dataIndex: "ReducedPM",
    key: "reducedPM",
    render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    sorter: (a, b) => parseFloat(a.ReducedPM) - parseFloat(b.ReducedPM),
    width: 200,
  },
  {
    title: "Actual Prevalence",
    dataIndex: "Actual_prevalence",
    key: "actualPrevalence",
    render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    sorter: (a, b) =>
      parseFloat(a.Actual_prevalence) - parseFloat(b.Actual_prevalence),
    width: 200,
  },
  {
    title: "Reduced Prevalence",
    dataIndex: "Reduced_prevalence",
    key: "reducedPrevalence",
    render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
    sorter: (a, b) =>
      parseFloat(a.Reduced_prevalence) - parseFloat(b.Reduced_prevalence),
    width: 200,
  },
];

const StateTable = ({ healthData, healthLoading, error }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Load and process health data
  useEffect(() => {
    if (healthData) {
      const averages = calculateAverages(healthData);
      setData(averages);
      setFilteredData(averages); 
    }
  }, [healthData]);

  // Filter data based on search input
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.state.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  // Handle loading and error states
  if (error) return <p>Error loading data.</p>;
  if (healthLoading) return <Spin size="large" />;

  return (
    <Card>
      <Row style={{ justifyContent: "space-between" }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <h2>Disease prevalence according to NFHS and PM2.5 concentration</h2>
        </Col>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Input
            placeholder="Search by state"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16, padding: 10 }}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      <div style={{ overflowX: "auto" }}>
        <Table
          columns={stateColumns}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={districtColumns}
                dataSource={record.districts}
                pagination={{ pageSize: 10 }}
                rowKey={(district) => district.District} // Unique key for district rows
              />
            ),
            rowExpandable: (record) => record.districts.length > 0,
          }}
          dataSource={filteredData}
          loading={healthLoading ? <Spin size="large" /> : false}
          rowKey={(record) => record.state}
          pagination={{ pageSize: 10 }} // Enable pagination for better usability
          scroll={{ x: 1000 }} 
        />
      </div>
    </Card>
  );
};

export default StateTable;

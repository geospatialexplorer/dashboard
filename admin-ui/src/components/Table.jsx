import { useState, useEffect } from "react";
import { Table, Card, Spin, Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const calculateAverages = (districtsData) => {
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
      {
        actualPM2_5: 0,
        reducedPM2_5: 0,
        actualPrevalence: 0,
        reducedPrevalence: 0,
      }
    );

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

const StateTable = ({ healthData, healthLoading, error }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (healthData) {
      const averages = calculateAverages(healthData);
      setData(averages);
      setFilteredData(averages); // Initialize filtered data
    }
  }, [healthData]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.state.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  if (error) return <p>Error loading data.</p>;

  const stateColumns = [
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => a.state.localeCompare(b.state),
      width: 200, // Set fixed width
    },
    {
      title: "Average Actual PM2.5",
      dataIndex: "averageActualPM2_5",
      key: "averageActualPM2_5",
      sorter: (a, b) => a.averageActualPM2_5 - b.averageActualPM2_5,
      width: 200, // Set fixed width
    },
    {
      title: "Average Reduced PM2.5",
      dataIndex: "averageReducedPM2_5",
      key: "averageReducedPM2_5",
      sorter: (a, b) => a.averageReducedPM2_5 - b.averageReducedPM2_5,
      width: 200, // Set fixed width
    },
    {
      title: "Average Actual Prevalence",
      dataIndex: "averageActualPrevalence",
      key: "averageActualPrevalence",
      sorter: (a, b) => a.averageActualPrevalence - b.averageActualPrevalence,
      width: 200, // Set fixed width
    },
    {
      title: "Average Reduced Prevalence",
      dataIndex: "averageReducedPrevalence",
      key: "averageReducedPrevalence",
      sorter: (a, b) => a.averageReducedPrevalence - b.averageReducedPrevalence,
      width: 200, // Set fixed width
    },
  ];

  const districtColumns = [
    {
      title: "District",
      dataIndex: "District",
      key: "district",
      sorter: (a, b) => a.District.localeCompare(b.District),
      width: 200, // Set fixed width
    },
    {
      title: "Actual PM2.5",
      dataIndex: "Actual PM2.5",
      key: "actualPM2_5",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
      sorter: (a, b) => a["Actual PM2.5"] - b["Actual PM2.5"],
      width: 200, // Set fixed width
    },
    {
      title: "Reduced PM2.5",
      dataIndex: "Reduced PM2.5",
      key: "reducedPM2_5",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
      sorter: (a, b) => a["Reduced PM2.5"] - b["Reduced PM2.5"],
      width: 200, // Set fixed width
    },
    {
      title: "Actual Prevalence",
      dataIndex: "Actual prevalence",
      key: "actualPrevalence",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
      sorter: (a, b) => a["Actual prevalence"] - b["Actual prevalence"],
      width: 200, // Set fixed width
    },
    {
      title: "Reduced Prevalence",
      dataIndex: "Reduced prevalence",
      key: "reducedPrevalence",
      render: (text) => (text ? parseFloat(text).toFixed(2) : "N/A"),
      sorter: (a, b) => a["Reduced prevalence"] - b["Reduced prevalence"],
      width: 200, // Set fixed width
    },
  ];

  return (
    <Card>
      <Row style={{justifyContent:"space-between"}}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <h2>State-level averages</h2>
        </Col>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Input
            placeholder="Search by state"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16,padding:10}}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
      <div style={{ overflowX: "auto" }}>
        {" "}
        {/* Enable horizontal scroll here */}
        <Table
          columns={stateColumns}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={districtColumns}
                dataSource={record.districts}
                pagination={false}
              />
            ),
            rowExpandable: (record) => record.districts.length > 0,
          }}
          dataSource={filteredData}
          loading={healthLoading ? <Spin size="large" /> : false}
          rowKey={(record) => record.state}
          pagination={false} // Disable pagination for a single table view
          scroll={{ x: 1000 }} // Set the scroll width as necessary
        />
      </div>
    </Card>
  );
};

export default StateTable;

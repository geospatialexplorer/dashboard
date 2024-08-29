import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Row, Col, Checkbox, Card, Form, Input, Button, Spin } from "antd";
import { ExpandOutlined, CompressOutlined } from "@ant-design/icons";

const OpenLayersMap = ({
  districtData,
  districtLoading,
  healthData,
  healthLoading,
}) => {
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [stateName, setStateName] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);

 const uniqueStates = healthData
   ? [...new Set(healthData.map((item) => item.State))].sort((a, b) =>
       a.localeCompare(b)
     )
   : [];


  const Disease = healthData
    ? [...new Set(healthData.map((item) => item.Disease))]
    : [];

  useEffect(() => {
    if (!mapRef.current) {
      vectorLayerRef.current = new VectorLayer({
        source: new VectorSource(),
      });

      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayerRef.current,
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      console.log("Map initialized");
    }
  }, []);

  useEffect(() => {
    if (filteredFeatures.length > 0 && mapRef.current) {
      console.log("Filtered features:", filteredFeatures);
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
    }
  }, [filteredFeatures]);

  const handleStateChange = (e) => {
    setStateName(e.target.value);
  };

  const handleStateCheckboxChange = (state, checked) => {
    setSelectedStates((prevSelectedStates) =>
      checked
        ? [...prevSelectedStates, state]
        : prevSelectedStates.filter((item) => item !== state)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = districtData.features.filter(
      (feature) =>
        feature.properties.State_Name.toLowerCase().includes(
          stateName.toLowerCase()
        ) &&
        (selectedStates.length === 0 ||
          selectedStates.includes(feature.properties.State_Name))
    );
    setFilteredFeatures(filtered);
  };

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
  };

  if (districtLoading || healthLoading) {
    return <Spin tip="Loading..." />;
  }

  return (
    <div style={{ paddingTop: "50px" }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Gender"
            bordered
            style={{ height: "100%" }}
            bodyStyle={{ display: "flex", flexDirection: "column" }}
          >
            <Checkbox> Select All</Checkbox>
            <br />
            <Checkbox> Men</Checkbox>
            <br />
            <Checkbox> Women</Checkbox>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="State"
            bordered
            style={{ height: "100%" }}
            bodyStyle={{ maxHeight: "130px", overflowY: "auto" }}
          >
            <Checkbox> Select All</Checkbox>
            <br />
            {uniqueStates.map((state, index) => (
              <div key={index}>
                <Checkbox
                  onChange={(e) =>
                    handleStateCheckboxChange(state, e.target.checked)
                  }
                >
                  {state}
                </Checkbox>
                <br />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card
            title="Disease"
            bordered
            style={{ height: "100%" }}
            bodyStyle={{ display: "flex", flexDirection: "column" }}
          >
            <Checkbox> Select All</Checkbox>
            <br />
            {Disease.map((disease, index) => (
              <div key={index}>
                <Checkbox
                  onChange={(e) =>
                    handleStateCheckboxChange(disease, e.target.checked)
                  }
                >
                  {disease}
                </Checkbox>
                <br />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Form onSubmitCapture={handleSubmit} style={{ marginBottom: "20px" }}>
        <Form.Item label="Enter State Name: ">
          <Input
            type="text"
            id="stateName"
            value={stateName}
            onChange={handleStateChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <Button
          onClick={toggleMapSize}
          icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>

        <div
          id="map"
          style={{
            width: isExpanded ? "100%" : "50%",
            height: "400px",
            transition: "width 0.3s ease",
            border: "1px solid black", // For debugging
          }}
        ></div>
      </div>
    </div>
  );
};

export default OpenLayersMap;

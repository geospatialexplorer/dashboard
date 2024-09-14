import React, { useState } from "react";
import { Row, Col, Card, Checkbox, Button } from "antd";
import HealthMap from "./Healthmap";

// Mock Data
const statesAndUTs = [
  "Andhra Pradesh",
  "Uttar Pradesh",
  "Gujarat",
  // ...rest of the states
];

const diseases = [
  "Diabetes",
  "Hypertension",
  "Chronic Respiratory Disease",
  // ...rest of the diseases
];

const gender = ["Men", "Women"];

// Components

const StateFilter = ({ selectedState, handleStateChange }) => (
  <Card
    title="State"
    bordered
    style={{ height: "100%" }}
    bodyStyle={{ maxHeight: "200px", overflowY: "auto" }}
  >
    {statesAndUTs.map((state, index) => (
      <div key={index}>
        <Checkbox
          value={state}
          onChange={handleStateChange}
          disabled={selectedState && selectedState !== state}
          checked={selectedState === state}
        >
          {state}
        </Checkbox>
        <br />
      </div>
    ))}
  </Card>
);

const DiseaseFilter = ({ selectedDisease, handleDiseaseChange }) => (
  <Card
    title="Disease"
    bordered
    style={{ height: "100%" }}
    bodyStyle={{ display: "flex", flexDirection: "column" }}
  >
    {diseases.map((disease, index) => (
      <div key={index}>
        <Checkbox
          value={disease}
          onChange={handleDiseaseChange}
          disabled={selectedDisease && selectedDisease !== disease}
          checked={selectedDisease === disease}
        >
          {disease}
        </Checkbox>
        <br />
      </div>
    ))}
  </Card>
);

const GenderFilter = ({
  selectedGender,
  handleGenderChange,
  handleFilterClick,
  handleResetClick,
}) => (
  <Card
    title="Gender"
    bordered
    style={{ height: "100%" }}
    bodyStyle={{ display: "flex", flexDirection: "column" }}
  >
    {gender.map((gen) => (
      <div key={gen}>
        <Checkbox
          value={gen}
          onChange={handleGenderChange}
          disabled={selectedGender && selectedGender !== gen}
          checked={selectedGender === gen}
        >
          {gen}
        </Checkbox>
        <br />
      </div>
    ))}
    <div style={{ marginTop: "20px" }}>
      <Button
        type="primary"
        onClick={handleFilterClick}
        style={{ marginRight: "10px" }}
      >
        Filter
      </Button>
      <Button type="dashed" onClick={handleResetClick}>
        Reset
      </Button>
    </div>
  </Card>
);

// Main Component

const FilterComponent = ({ onFilter }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(selectedState === value ? null : value);
  };

  const handleDiseaseChange = (e) => {
    const value = e.target.value;
    setSelectedDisease(selectedDisease === value ? null : value);
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setSelectedGender(selectedGender === value ? null : value);
  };

  const handleResetClick = () => {
    setSelectedState(null);
    setSelectedDisease(null);
    setSelectedGender(null);
  };

  const handleFilterClick = () => {
    onFilter({ selectedState, selectedDisease, selectedGender });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          marginTop: "50px",
          boxShadow: "2px 3px 8px #ccc",
          padding: "20px",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8}>
            <StateFilter
              selectedState={selectedState}
              handleStateChange={handleStateChange}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <DiseaseFilter
              selectedDisease={selectedDisease}
              handleDiseaseChange={handleDiseaseChange}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <GenderFilter
              selectedGender={selectedGender}
              handleGenderChange={handleGenderChange}
              handleFilterClick={handleFilterClick}
              handleResetClick={handleResetClick}
            />
          </Col>
        </Row>
      </div>
      <HealthMap></HealthMap>
    </div>
  );
};

export default FilterComponent;

import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay.js";
import FilterComponent from "./FilterComponent";
// import { Chart } from "chart.js";
import Chart from "../components/Chart";
import StateTable from "./Table";
import { Row, Col, Card, Checkbox, Button } from "antd";

// import "./HealthMap.css";

// const DISTRICT_API_URL = "https://sheetdb.io/api/v1/x0im8yne6vc93";
const HEALTH_API_URL = "https://sheetdb.io/api/v1/iv147xri3ae3i";

const HealthMap = ({}) => {
  const popupRef = useRef();

  const [popupContent, setPopupContent] = useState("");
  const [map, setMap] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const [features, setFeatures] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [resetHealthData, setResetHealthData] = useState([]);

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
    resetLayer();
  };

  const handleFilterClick = () => {
    resetLayer();
    // console.log(selectedState, selectedDisease, selectedGender);
    // onFilter({ selectedState, selectedDisease, selectedGender });
    queryLayer(selectedState, selectedDisease, selectedGender);
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabaseUrl = "https://pdtmpyckpklkfikjvpnd.supabase.co";
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdG1weWNrcGtsa2Zpa2p2cG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDUwNDQyMywiZXhwIjoyMDQwMDgwNDIzfQ.FZxR7cZefz012P2knSzTaBHHrcSXFhrEcSsZOMxhPGk"; // Replace with your actual Supabase key
      const tableName = "district";
      const healthTableName = "health";

      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${tableName}?select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const geoData = data.map((row) => ({
            type: "Feature",
            geometry: row.geom,
            properties: row,
          }));
          //   console.log(geoData, "ppppppppppppppppppppp");
          //   setDistrictData(geoData);
          setDistrictData(data); // Initially, show all features
          setFilteredFeatures(geoData);
          setFeatures(geoData);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchHealthData = async () => {
      try {
        const response = await fetch(HEALTH_API_URL, {
          method: "GET", // or 'POST' if needed
          headers: {
            "Content-Type": "application/json",
            //   'Authorization': 'Bearer YOUR_API_TOKEN' // if you need authentication
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setHealthData(data);
        setResetHealthData(data);
        // return data; // Return the data for further processing
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    // Call the fetch function
    fetchHealthData();
    fetchData();
  }, []);

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
          projection: "EPSG:4326",
        }),
      });
    }
    // Create an overlay for the popup
    const overlay = new Overlay({
      element: popupRef.current,
      // autoPan: true,
      // autoPanAnimation: {
      //   duration: 250,
      // },
    });

    mapRef.current.addOverlay(overlay);
    let lastFeature = null; // Track the last hovered feature
    // Handle map click events
    mapRef.current.on("singleclick", function (event) {
      const feature = mapRef.current.forEachFeatureAtPixel(
        event.pixel,
        (feat) => feat
      );

      // Only update if the hovered feature has changed

      if (feature) {
        const properties = feature.getProperties();
        console.log(properties, "==========");
        setPopupContent(
          `<div>
                <div>District: ${properties["district"]}</div>
                <div>Actual Prevalence: ${properties.properties["Actual_prevalence"]}</div>
                <div>Reduced Prevalence: ${properties.properties["Reduced_prevalence"]}</div>
              </div>`
        );
        overlay.setPosition(event.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    if (filteredFeatures.length > 0) {
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

  //main query for the map
  const queryLayer = (state, disease, gender) => {
    //style the element

    const getFeatureStyle = (prevalenceValue) => {
      if (prevalenceValue < 0.05) {
        return new Style({
          fill: new Fill({
            color: "rgba(0, 255, 0, 0.5)", // Green for <1
          }),
          stroke: new Stroke({
            color: "#00FF00",
            width: 1,
          }),
        });
      } else if (prevalenceValue >= 0.05 && prevalenceValue <= 1) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 255, 0, 0.5)", // Yellow for 1-2
          }),
          stroke: new Stroke({
            color: "#FFFF00",
            width: 1,
          }),
        });
      } else if (prevalenceValue > 1 && prevalenceValue <= 4) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 165, 0, 0.5)", // Orange for 3-4
          }),
          stroke: new Stroke({
            color: "#FFA500",
            width: 1,
          }),
        });
      } else if (prevalenceValue > 4) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.5)", // Red for >4
          }),
          stroke: new Stroke({
            color: "#FF0000",
            width: 1,
          }),
        });
      } else {
        return new Style({
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.5)", // Blue for undefined or out of range values
          }),
          stroke: new Stroke({
            color: "#0000FF",
            width: 1,
          }),
        });
      }
    };
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();
    if (districtData.length > 0 && healthData.length > 0 && !map) {
      const filterdStateData = districtData.filter((feature) => {
        return feature.statename === state;
      });

      const filterdHealthData = healthData.filter((feature) => {
        return (
          feature.State === state &&
          feature.Disease === disease &&
          feature.Gender === gender
        );
      });

      setHealthData(filterdHealthData);

      const combinedData = filterdStateData.map((featureRecord) => {
        const matchingHealth = filterdHealthData.find(
          (health) =>
            health.District.trim().toLowerCase() ===
            featureRecord.district.trim().toLowerCase()
        );

        if (matchingHealth) {
          featureRecord.properties = matchingHealth;
          return {
            ...featureRecord,
            ...matchingHealth,
          };
        }

        return featureRecord;
      });

      console.log(combinedData);

      const combinedFeature = combinedData.map((row) => ({
        type: "Feature",
        geometry: row.geom,
        properties: row,
      }));

      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: combinedFeature,
        })
      );

      vectorSource.getFeatures().forEach((feature) => {
        console.log(feature, "ffffffffffffffffffff");
        //   const prevalenceValue = feature.get("prevalance"); // Ensure this is a number
        const prevalenceValue = feature.values_.Actual_prevalence;
        // Ensure this is a number

        // console.log(prevalenceValue, "------------Prevalance-------");
        const style = getFeatureStyle(prevalenceValue);
        feature.setStyle(style);
      });

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
    }

    // if (filteredFeatures.length > 0) {
    // }
  };

  const resetLayer = () => {
    setHealthData(resetHealthData);
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();
    console.log(features, "featuresssssssssss");
    // setFilteredFeatures(features);
    vectorSource.addFeatures(
      new GeoJSON().readFeatures({
        type: "FeatureCollection",
        features: features,
      })
    );
    const extent = vectorSource.getExtent();
    mapRef.current.getView().fit(extent, {
      size: mapRef.current.getSize(),
      maxZoom: 10,
    });
  };

  return (
    <div>
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
        {/* <HealthMap></HealthMap> */}
      </div>
      <div id="map" style={{ width: "100%", height: "80vh" }}></div>;
      {/* <div>
        <button onClick={queryLayer}>Query</button>
        <button onClick={resetLayer}>Reset</button>
      </div> */}
      <div ref={popupRef} className="ol-popup" style={popupStyle}>
        <div
          id="popup-content"
          dangerouslySetInnerHTML={{ __html: popupContent }}
        />
      </div>
      <Chart healthData={healthData} />
      <StateTable healthData={healthData} />
    </div>
  );
};

// Custom popup styling
const popupStyle = {
  position: "absolute",
  background: "white",
  borderRadius: "5px",
  padding: "10px",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
  border: "1px solid black",
  zIndex: 1000,
};

export default HealthMap;

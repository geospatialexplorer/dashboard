import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";
import { Row, Col, Checkbox, Card, Button } from "antd";
import { ExpandOutlined, CompressOutlined } from "@ant-design/icons";
import {
  useGetDistrictDataQuery,
  useGetHealthDataQuery,
} from "../services/Api";
import Overlay from "ol/Overlay.js";
import LegendComponent from "./Legend";
import "../index.css";

const OpenLayersMap = ({ onPassAverages }) => {
  const popupRef = useRef();
  const reducedPopupRef = useRef();
  const [popupContent, setPopupContent] = useState("");
  const [reducedPopupContent, setReducedPopupContent] = useState("");
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);

  const [uniqueStates, setUniqueStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [isMap1Expanded, setIsMap1Expanded] = useState(false);
  const [isMap2Expanded, setIsMap2Expanded] = useState(false);

  const { data: districtData, isLoading: districtLoading } = useGetDistrictDataQuery();
  const { data: healthData, isLoading: healthLoading } = useGetHealthDataQuery();

  const mapRef = useRef(null);
  const reducedMapRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const reducedLayerRef = useRef(null);

  const statesAndUTs = [
    "Andhra Pradesh",
    "Uttar Pradesh",
    "Gujarat",
    "Maharashtra",
    "Mizoram",
    "Rajasthan",
    "Kerala",
    "Madhya Pradesh",
    "Punjab",
    "Uttarakhand",
    "Haryana",
    "Jammu & Kashmir",
    "Arunanchal Pradesh",
    "Odisha",
    "Bihar",
    "Tamil Nadu",
    "West Bengal",
    "Karnataka",
    "Assam",
    "Himachal Pradesh",
    "Chhattisgarh",
    "Manipur",
    "Jharkhand",
    "NCT of Delhi",
    "Chandigarh",
    "Dadara & Nagar Havelli",
    "Daman & Diu",
    "Tripura",
    "Nagaland",
    "Sikkim",
    "Meghalaya",
    "Puducherry",
    "Goa",
    "Andaman & Nicobar Island",
    "Lakshadweep",
  ];

  const diseases = [
    "Diabetes",
    "Hypertension",
    "Chronic Respiratory Disease",
    "Heart disease",
    "Cancer",
  ];

  const gender = ["Men", "Women"];

  const toggleMap1Size = () => {
    setIsMap1Expanded(!isMap1Expanded);
    setIsMap2Expanded(false); // Collapse Map 2 when Map 1 is expanded
  };

  const toggleMap2Size = () => {
    setIsMap2Expanded(!isMap2Expanded);
    setIsMap1Expanded(false); // Collapse Map 1 when Map 2 is expanded
  };

  const handleDiseaseChange = (e) => {
    const value = e.target.value;
    setSelectedDisease(selectedDisease === value ? null : value);
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setSelectedGender(selectedGender === value ? null : value);
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(selectedState === value ? null : value);
  };

  const handleFilterClick = () => {
    console.log(features, "features after filterd the data");
    getMapData(
      healthData,
      features,
      selectedDisease,
      selectedState,
      selectedGender
    );
  };

  const handleResetClick = () => {
    setSelectedDisease(null);
    setSelectedGender(null);
    setSelectedState(null);
    setFilteredFeatures(features);

    // Hide both popups
    mapRef.current
      .getOverlays()
      .forEach((overlay) => overlay.setPosition(undefined));
    reducedMapRef.current
      .getOverlays()
      .forEach((overlay) => overlay.setPosition(undefined));

    // Reset feature styles on the map
    const vectorSource = vectorLayerRef.current.getSource();
    // vectorSource.clear();
    vectorSource.getFeatures().forEach((feature) => {
      feature.setStyle(null); // Removes custom styling, reverting to default
    });

    const reducedVectorSource = reducedLayerRef.current.getSource();
    reducedVectorSource.getFeatures().forEach((feature) => {
      feature.setStyle(null); // Removes custom styling, reverting to default
    });
  };

  useEffect(() => {
    if (districtData) {
      const geoData = districtData.map((row) => ({
        type: "Feature",
        geometry: row.geom,
        properties: row,
      }));
      setFeatures(geoData);
      setFilteredFeatures(geoData);
    }
  }, [districtData]);

  useEffect(() => {
    if (!mapRef.current || !reducedMapRef) {
      vectorLayerRef.current = new VectorLayer({
        source: new VectorSource(),
      });

      reducedLayerRef.current = new VectorLayer({
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

      // Create an overlay for the popup
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      // Create an overlay for the reduced popup
      const reducedOverlay = new Overlay({
        element: reducedPopupRef.current,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      reducedMapRef.current = new Map({
        target: "reducedMap",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          reducedLayerRef.current,
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
          projection: "EPSG:4326",
        }),
      });

      mapRef.current.addOverlay(overlay);
      reducedMapRef.current.addOverlay(reducedOverlay);

      // Handle map click events
      mapRef.current.on("singleclick", function (event) {
        const feature = mapRef.current.forEachFeatureAtPixel(
          event.pixel,
          (feat) => feat
        );
        if (feature) {
          const properties = feature.getProperties();
          setPopupContent(
            `<div>
              <div>District: ${properties["District"]}</div>
              <div>Actual Prevalence: ${properties["Actual_prevalence"]}</div>
              <div>Reduced Prevalence: ${properties["Reduced_prevalence"]}</div>
            </div>`
          );
          overlay.setPosition(event.coordinate);
        } else {
          overlay.setPosition(undefined);
        }
      });

      // Handle map click events on reduced map
      reducedMapRef.current.on("singleclick", function (event) {
        const feature = reducedMapRef.current.forEachFeatureAtPixel(
          event.pixel,
          (feat) => feat
        );
        if (feature) {
          const properties = feature.getProperties();
          setReducedPopupContent(
            `<div>
              <div>District: ${properties["District"]}</div>
              <div>Actual Prevalence: ${properties["Actual prevalence"]}</div>
              <div>Reduced Prevalence: ${properties["Reduced_prevalence"]}</div>
            </div>`
          );
          reducedOverlay.setPosition(event.coordinate);
        } else {
          reducedOverlay.setPosition(undefined);
        }
      });
    }

    if (filteredFeatures.length > 0) {
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      const reducedVectorSource = reducedLayerRef.current.getSource();
      reducedVectorSource.clear();
      reducedVectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      vectorSource.getFeatures().forEach((feature) => {
        const prevalenceValue = feature.get("Actual prevalence");
        const style = getFeatureStyle(prevalenceValue);
        feature.setStyle(style);
      });

      reducedVectorSource.getFeatures().forEach((feature) => {
        const prevalenceValue = feature.get("Reduced prevalence");
        const style = getFeatureStyle(prevalenceValue);
        feature.setStyle(style);
      });

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
      reducedMapRef.current.getView().fit(extent, {
        size: reducedMapRef.current.getSize(),
        maxZoom: 10,
      });
    }

    if (features.length > 0) {
      const uniqueStateNames = [
        ...new Set(features.map((feature) => feature.properties.statename)),
      ];
      setUniqueStates(uniqueStateNames);
    }
  }, [filteredFeatures]);

  const getFeatureStyle = (prevalenceValue) => {
    if (prevalenceValue < 1) {
      return new Style({
        fill: new Fill({
          color: "rgba(0, 255, 0, 0.5)", // Green for <1
        }),
        stroke: new Stroke({
          color: "#00FF00",
          width: 1,
        }),
      });
    } else if (prevalenceValue >= 1 && prevalenceValue <= 2) {
      return new Style({
        fill: new Fill({
          color: "rgba(255, 255, 0, 0.5)", // Yellow for 1-2
        }),
        stroke: new Stroke({
          color: "#FFFF00",
          width: 1,
        }),
      });
    } else if (prevalenceValue > 2 && prevalenceValue <= 4) {
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

  const calculateAverage = (dataArray, property) => {
    if (dataArray.length === 0) return 0;

    const values = dataArray
      .map((item) => parseFloat(item.properties?.[property]))
      .filter((value) => !isNaN(value));

    const sum = values.reduce((acc, value) => acc + value, 0);

    const Average = values.length > 0 ? sum / values.length : 0;

    return Average.toFixed(2);
  };

  const getMapData = (healthData, features, disease, state, gender) => {
    if (healthData.length > 0 && features.length > 0) {
      const filterdDisease = healthData.filter((feature) => {
        return (
          feature.Disease === disease &&
          feature.State.trim().toLowerCase() === state?.trim().toLowerCase()
        );
      });

      const filterByState = (data, stateName) => {
        return data.filter((item) => item.properties.statename === stateName);
      };

      const geomData = filterByState(features, state);

      const combinedData = geomData.map((featureRecord) => {
        const matchingHealth = filterdDisease.find(
          (health) =>
            health.District.trim().toLowerCase() ===
            featureRecord.properties.district.trim().toLowerCase()
        );

        if (matchingHealth) {
          featureRecord.properties = matchingHealth;
        }

        return featureRecord;
      });

      console.log(combinedData, "Combined Data");

      setFilteredFeatures(combinedData);

      const averageActualPrevalence = calculateAverage(
        combinedData,
        "Actual prevalence"
      );
      const averageReducedPrevalence = calculateAverage(
        combinedData,
        "Reduced prevalence"
      );

      const averageReducedTwo = calculateAverage(combinedData, "Actual PM2.5");
      const averageActualTwo = calculateAverage(combinedData, "Reduced PM2.5");

      // console.log("Average Actual Prevalence:", averageActualPrevalence);
      // console.log("Average Reduced Prevalence:", averageReducedPrevalence);
      // console.log("Average Reduced PM2.5:", averageReducedTwo);
      // console.log("Average Actual PM2.5:", averageActualTwo);

      onPassAverages(
        averageReducedTwo,
        averageActualTwo,
        averageReducedPrevalence,
        averageActualPrevalence
      );
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          marginTop: "50px",
          boxShadow: "2px 3px 8px #ccc",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8}>
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
          </Col>
          <Col xs={24} sm={24} md={8}>
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
          </Col>
          <Col xs={24} sm={24} md={8}>
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
              <div>
                <Button
                  type="dashed"
                  onClick={handleResetClick}
                  style={{ position: "absolute", bottom: "10px" }}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  onClick={handleFilterClick}
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "100px",
                  }}
                >
                  Filter
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ width: "40%" }}>The Actual prevalence map</h2>
        <h2 style={{ width: "40%" }}>The Reduced prevalence map</h2>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Map 1 */}
        <div
          id="map"
          style={{
            height: "400px",
            width: isMap1Expanded ? "100%" : "45%",
            marginRight: isMap1Expanded ? "0" : "10%",
            boxShadow: "2px 3px 8px #ccc",
            transition: "all 0.5s",
            display: "inline-block",
            verticalAlign: "top",
          }}
        ></div>
        {/* { Map 2} */}
        <div
          id="reducedMap"
          style={{
            height: "400px",
            width: isMap2Expanded ? "100%" : "45%",
            marginLeft: isMap2Expanded ? "0" : "10%",
            boxShadow: "2px 3px 8px #ccc",
            transition: "all 0.5s",
            display: "inline-block",
          }}
        ></div>

        <Button
          type="default"
          size="large"
          onClick={toggleMap1Size}
          icon={isMap1Expanded ? <CompressOutlined /> : <ExpandOutlined />}
          style={{
            position: "absolute",
            top: "60px",
            left: "1px",
            zIndex: 1000,
          }}
        />

        <Button
          type="default"
          size="large"
          onClick={toggleMap2Size}
          icon={isMap2Expanded ? <CompressOutlined /> : <ExpandOutlined />}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        />
        <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
          <LegendComponent />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: isMap2Expanded ? "300px" : "150px",
          }}
        >
          <LegendComponent />
        </div>

        <div ref={popupRef} className="ol-popup" style={popupStyle}>
          <div
            id="popup-content"
            dangerouslySetInnerHTML={{ __html: popupContent }}
          />
        </div>
        <div ref={reducedPopupRef} className="ol-popup" style={popupStyle}>
          <div
            id="reducedPopup-content"
            dangerouslySetInnerHTML={{ __html: reducedPopupContent }}
          />
        </div>
      </div>
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

export default OpenLayersMap;

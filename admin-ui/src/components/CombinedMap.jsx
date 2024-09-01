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

const OpenLayersMap = () => {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);

  const [uniqueStates, setUniqueStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: districtData, isLoading: districtLoading } =
    useGetDistrictDataQuery();
  const { data: healthData, isLoading: healthLoading } =
    useGetHealthDataQuery();

  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);

  const diseases = [
    "Diabetes",
    "Hypertension",
    "Chronic Respiratory Disease",
    "Heart disease",
    "Cancer",
  ];

  const gender = ["Men", "Women"];

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
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
    getMapData(
      healthData,
      features,
      selectedDisease,
      selectedState,
      selectedGender
    );
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

    if (filteredFeatures.length > 0) {
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
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

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
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

  const getMapData = (healthData, features, disease, state, gender) => {
    if (healthData?.length > 0 && features?.length > 0) {
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
          featureRecord.properties = {
            ...featureRecord.properties,
            ...matchingHealth,
          };
        }

        return featureRecord;
      });

      setFilteredFeatures(combinedData);
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
              {uniqueStates.map((state, index) => (
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
              <Button
                type="dashed"
                
                onClick={handleFilterClick}
                style={{ position: "absolute", bottom:"10px"}}
              >
                Filter
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ position: "relative" }}>
        <div
          id="map"
          style={{
            height: "400px",
            width: isExpanded ? "100%" : "50%",
            boxShadow: "2px 3px 8px #ccc",
            transition: "all 0.3s"
          }}
        />
        <Button
          type="default"
          size="large"
          onClick={toggleMapSize}
          icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        />
      </div>
    </div>
  );
};

export default OpenLayersMap;
